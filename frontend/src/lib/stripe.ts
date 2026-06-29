import { loadStripe, type Stripe } from "@stripe/stripe-js";

const KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

/** True when a Stripe publishable key is configured (real Elements flow). */
export const stripeEnabled = !!KEY;

// Load Stripe.js once (only when a key is present). Publishable key is safe on
// the client; the secret key lives only on the backend.
export const stripePromise: Promise<Stripe | null> | null = KEY ? loadStripe(KEY) : null;
