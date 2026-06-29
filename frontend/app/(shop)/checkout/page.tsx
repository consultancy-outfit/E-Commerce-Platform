"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Protected from "@/src/components/Protected";
import StatusBadge from "@/src/components/StatusBadge";
import { useToast } from "@/src/components/ToastProvider";
import { imageUrl } from "@/src/lib/api/baseApi";
import { gbp } from "@/src/lib/format";
import { stripeEnabled, stripePromise } from "@/src/lib/stripe";
import { useAppSelector } from "@/src/lib/hooks";
import { useGetCartQuery } from "@/src/features/cart/cartApi";
import { useCheckoutMutation, useCreatePaymentIntentMutation } from "@/src/features/orders/ordersApi";
import { checkoutSchema, type CheckoutValues } from "@/src/schemas/checkout";

function CheckoutInner() {
  const router = useRouter();
  const toast = useToast();
  const theme = useTheme();
  const stripe = useStripe();
  const elements = useElements();
  const user = useAppSelector((s) => s.auth.user);
  const { data: cart } = useGetCartQuery();
  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  const [checkout] = useCheckoutMutation();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutValues>({
    resolver: yupResolver(checkoutSchema),
    defaultValues: {
      email: user?.email ?? "",
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      line1: "",
      city: "",
      postcode: "",
    },
  });

  React.useEffect(() => {
    if (cart && cart.items.length === 0) router.replace("/cart");
  }, [cart, router]);

  // Stripe CardElement styled to match the Maison inputs (theme-aware).
  const cardOptions = React.useMemo(
    () => ({
      style: {
        base: {
          color: theme.palette.text.primary,
          fontFamily: "'Hanken Grotesk', sans-serif",
          fontSize: "14px",
          iconColor: theme.palette.text.secondary,
          "::placeholder": { color: theme.palette.text.disabled },
        },
        invalid: { color: theme.palette.error.main, iconColor: theme.palette.error.main },
      },
    }),
    [theme],
  );

  const onSubmit = async (v: CheckoutValues) => {
    setServerError(null);
    setSubmitting(true);
    try {
      let paymentIntentId: string | undefined;

      if (stripeEnabled) {
        if (!stripe || !elements) {
          setServerError("Payment form is still loading — please wait a moment.");
          return;
        }
        const card = elements.getElement(CardElement);
        if (!card) {
          setServerError("Please enter your card details.");
          return;
        }
        // 1. Create a PaymentIntent for the cart (server computes the amount).
        const { clientSecret } = await createPaymentIntent().unwrap();
        // 2. Confirm the card payment on the client via Stripe Elements.
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card,
            billing_details: { name: `${v.firstName} ${v.lastName}`, email: v.email },
          },
        });
        if (result.error) {
          const text = result.error.message ?? "Your card could not be charged.";
          setServerError(text);
          toast({ title: "Payment failed", text, severity: "error" });
          return;
        }
        if (result.paymentIntent?.status !== "succeeded") {
          const text = "Payment was not completed. No order was placed.";
          setServerError(text);
          toast({ title: "Payment incomplete", text, severity: "error" });
          return;
        }
        paymentIntentId = result.paymentIntent.id;
      }

      // 3. Create the order — the backend verifies the succeeded PaymentIntent.
      const order = await checkout({
        shippingAddress: { firstName: v.firstName, lastName: v.lastName, line1: v.line1, city: v.city, postcode: v.postcode },
        paymentIntentId,
      }).unwrap();
      toast({ title: "Order placed", text: "Thank you — your payment was successful.", severity: "success" });
      router.push(`/confirmation?id=${order._id}`);
    } catch (err) {
      const e = err as { data?: { message?: string | string[] } };
      const msg = e.data?.message;
      const text = Array.isArray(msg) ? msg[0] : msg || "Checkout failed. Please try again.";
      setServerError(text);
      toast({ title: "Checkout failed", text, severity: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const field = (label: string, name: keyof CheckoutValues, extra?: object) => (
    <TextField
      fullWidth
      size="small"
      placeholder={label}
      {...register(name)}
      error={!!errors[name]}
      helperText={errors[name]?.message}
      {...extra}
    />
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: 5, py: 4.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, fontSize: 13, color: "text.disabled", mb: 3.5 }}>
        <Box component="span" onClick={() => router.push("/cart")} sx={{ color: "secondary.main", cursor: "pointer" }}>
          Cart
        </Box>
        <span>›</span>
        <Box component="span" sx={{ color: "text.primary", fontWeight: 600 }}>Checkout</Box>
        <span>›</span>
        <span>Confirmation</span>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box sx={{ display: "flex", gap: 6, flexWrap: { xs: "wrap", md: "nowrap" } }}>
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Typography variant="h5" sx={{ fontSize: 20, mb: 2 }}>Contact</Typography>
            <Box sx={{ mb: 3.5 }}>{field("you@example.com", "email")}</Box>

            <Typography variant="h5" sx={{ fontSize: 20, mb: 2 }}>Shipping address</Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.75, mb: 3.5 }}>
              {field("First name", "firstName")}
              {field("Last name", "lastName")}
              <Box sx={{ gridColumn: "1 / 3" }}>{field("Address", "line1")}</Box>
              {field("City", "city")}
              {field("Postcode", "postcode")}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
              <Typography variant="h5" sx={{ fontSize: 20 }}>Payment</Typography>
              <StatusBadge label="Test mode" />
            </Box>
            <Box sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "maison.line.l10", borderRadius: 2, p: 2.75 }}>
              {stripeEnabled ? (
                <Box
                  sx={{
                    bgcolor: "maison.surface2",
                    border: "1px solid",
                    borderColor: "maison.line.l16",
                    borderRadius: 1,
                    px: 1.75,
                    py: 1.75,
                  }}
                >
                  <CardElement options={cardOptions} />
                </Box>
              ) : (
                <>
                  <TextField fullWidth size="small" defaultValue="4242 4242 4242 4242" sx={{ mb: 1.75 }} slotProps={{ htmlInput: { readOnly: true } }} />
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.75 }}>
                    <TextField fullWidth size="small" defaultValue="12 / 28" slotProps={{ htmlInput: { readOnly: true } }} />
                    <TextField fullWidth size="small" defaultValue="123" slotProps={{ htmlInput: { readOnly: true } }} />
                  </Box>
                </>
              )}
              <Typography sx={{ fontSize: 12, color: "text.disabled", mt: 1.5 }}>
                Stripe test mode — use card 4242 4242 4242 4242, any future expiry &amp; any CVC. No real charge is made.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ width: { xs: "100%", md: 380 }, flexShrink: 0 }}>
            <Box sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "maison.line.l10", borderRadius: 2, p: 3.25 }}>
              <Typography variant="h5" sx={{ fontSize: 20, mb: 2.5 }}>Summary</Typography>
              {cart?.items.map((line) => (
                <Box key={`${line.productId}-${line.size}`} sx={{ display: "flex", gap: 1.75, mb: 2 }}>
                  <Box sx={{ width: 54, height: 68, borderRadius: 1, overflow: "hidden", bgcolor: "maison.surfaceImg", flexShrink: 0 }}>
                    {line.product.image && <Box component="img" src={imageUrl(line.product.image)} alt={line.product.name} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 500, fontSize: 14 }}>{line.product.name}</Typography>
                    <Typography sx={{ fontSize: 12, color: "text.disabled" }}>{line.product.category} · Size {line.size} · ×{line.quantity}</Typography>
                    <Typography sx={{ fontSize: 11.5, color: "text.disabled" }}>{line.product.stock} in stock</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{gbp(line.lineTotal)}</Typography>
                </Box>
              ))}
              <Box sx={{ height: "1px", bgcolor: "maison.line.l10", my: 2.25 }} />
              <Summary label="Subtotal" value={gbp(cart?.subtotal ?? 0)} />
              <Summary label="Shipping" value="Free" color="success.main" />
              <Summary label="Tax" value={gbp(cart?.tax ?? 0)} />
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mt: 1, mb: 2.75 }}>
                <Typography sx={{ fontWeight: 500, fontSize: 15 }}>Total</Typography>
                <Typography variant="h5" sx={{ fontSize: 26 }}>{gbp(cart?.total ?? 0)}</Typography>
              </Box>
              {serverError && <Typography sx={{ color: "error.main", fontSize: 13, mb: 1.5 }}>{serverError}</Typography>}
              <Button
                type="submit"
                fullWidth
                disabled={submitting || !cart?.items.length || (stripeEnabled && !stripe)}
                sx={{ py: 1.7 }}
              >
                {submitting ? "Processing…" : `Pay ${gbp(cart?.total ?? 0)}`}
              </Button>
            </Box>
          </Box>
        </Box>
      </form>
    </Box>
  );
}

function Summary({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "text.secondary", mb: 1.25 }}>
      <span>{label}</span>
      <Box component="span" sx={{ color }}>{value}</Box>
    </Box>
  );
}

export default function CheckoutPage() {
  return (
    <Protected>
      <Elements stripe={stripePromise}>
        <CheckoutInner />
      </Elements>
    </Protected>
  );
}
