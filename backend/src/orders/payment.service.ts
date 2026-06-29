import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { randomBytes } from 'crypto';

export interface PaymentResult {
  ref: string;
  mocked: boolean;
}

/**
 * Processes the checkout payment. If a Stripe TEST secret key is configured it
 * creates and confirms a PaymentIntent in test mode; otherwise it falls back to
 * a clearly-labelled mock so the end-to-end flow always works (documented in
 * NOTES.md). Real card data never touches this server.
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

  async charge(amount: number, paymentMethodId?: string): Promise<PaymentResult> {
    if (!this.stripe) {
      return { ref: `mock_${randomBytes(10).toString('hex')}`, mocked: true };
    }
    try {
      const intent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // pence
        currency: 'gbp',
        payment_method: paymentMethodId ?? 'pm_card_visa', // Stripe test PM
        confirm: true,
        automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
      });
      if (intent.status !== 'succeeded') {
        throw new HttpException(`Payment not completed (${intent.status})`, HttpStatus.PAYMENT_REQUIRED);
      }
      return { ref: intent.id, mocked: false };
    } catch (err) {
      this.logger.error('Stripe payment failed', err as Error);
      throw new HttpException('Payment could not be processed', HttpStatus.PAYMENT_REQUIRED);
    }
  }
}
