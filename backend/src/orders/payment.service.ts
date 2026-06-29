import { BadRequestException, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { randomBytes } from 'crypto';

export interface CreatedIntent {
  id: string;
  clientSecret: string;
  mocked: boolean;
}

/**
 * Stripe (TEST mode) payment handling using the PaymentIntents + Elements flow:
 * the backend creates a PaymentIntent (client confirms it with Stripe Elements),
 * then verifies the succeeded intent before an order is created. If no Stripe
 * secret key is configured it falls back to a clearly-labelled mock so the flow
 * still works (documented in NOTES.md). The secret key never leaves the server.
 */
@Injectable()
export class PaymentService {
  private readonly logger = new Logger('Payment');
  private readonly stripe: Stripe | null;

  constructor(config: ConfigService) {
    const key = config.get<string>('stripeSecretKey');
    this.stripe = key ? new Stripe(key) : null;
    if (!this.stripe) {
      this.logger.warn('STRIPE_SECRET_KEY not set — using mock payments (test mode)');
    }
  }

  get live(): boolean {
    return !!this.stripe;
  }

  private toMinor(amount: number): number {
    return Math.round(amount * 100);
  }

  /** Create a PaymentIntent for the given GBP amount; returns its client secret. */
  async createIntent(amount: number): Promise<CreatedIntent> {
    if (!this.stripe) {
      const id = `mock_pi_${randomBytes(10).toString('hex')}`;
      return { id, clientSecret: `${id}_secret`, mocked: true };
    }
    const intent = await this.stripe.paymentIntents.create({
      amount: this.toMinor(amount),
      currency: 'gbp',
      automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
    });
    return { id: intent.id, clientSecret: intent.client_secret as string, mocked: false };
  }

  /**
   * Verify a PaymentIntent that the client confirmed via Elements: it must exist,
   * be `succeeded`, and match the server-computed amount. Returns the payment ref.
   * In mock mode (no key) any non-empty id is accepted.
   */
  async verify(paymentIntentId: string | undefined, expectedAmount: number): Promise<string> {
    if (!this.stripe) {
      return paymentIntentId || `mock_pi_${randomBytes(10).toString('hex')}`;
    }
    if (!paymentIntentId) {
      throw new BadRequestException('Missing payment reference');
    }
    let intent: Stripe.PaymentIntent;
    try {
      intent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (err) {
      this.logger.error('Stripe retrieve failed', err as Error);
      throw new HttpException('Could not verify payment', HttpStatus.PAYMENT_REQUIRED);
    }
    if (intent.status !== 'succeeded') {
      throw new HttpException(`Payment not completed (${intent.status})`, HttpStatus.PAYMENT_REQUIRED);
    }
    if (intent.amount !== this.toMinor(expectedAmount)) {
      // Guards against a client tampering with the amount.
      throw new BadRequestException('Payment amount does not match order total');
    }
    return intent.id;
  }
}
