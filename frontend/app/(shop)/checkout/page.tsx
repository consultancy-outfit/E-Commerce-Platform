"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, TextField, Typography } from "@mui/material";
import Protected from "@/src/components/Protected";
import StatusBadge from "@/src/components/StatusBadge";
import { useToast } from "@/src/components/ToastProvider";
import { imageUrl } from "@/src/lib/api/baseApi";
import { gbp } from "@/src/lib/format";
import { useAppSelector } from "@/src/lib/hooks";
import { useGetCartQuery } from "@/src/features/cart/cartApi";
import { useCheckoutMutation } from "@/src/features/orders/ordersApi";
import { checkoutSchema, type CheckoutValues } from "@/src/schemas/checkout";

function CheckoutInner() {
  const router = useRouter();
  const toast = useToast();
  const user = useAppSelector((s) => s.auth.user);
  const { data: cart } = useGetCartQuery();
  const [checkout, { isLoading }] = useCheckoutMutation();
  const [serverError, setServerError] = React.useState<string | null>(null);

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

  const onSubmit = async (v: CheckoutValues) => {
    setServerError(null);
    try {
      const order = await checkout({
        shippingAddress: { firstName: v.firstName, lastName: v.lastName, line1: v.line1, city: v.city, postcode: v.postcode },
      }).unwrap();
      toast({ title: "Order placed", text: "Thank you — your order is confirmed.", severity: "success" });
      router.push(`/confirmation?id=${order._id}`);
    } catch (err) {
      const e = err as { data?: { message?: string | string[] } };
      const msg = e.data?.message;
      const text = Array.isArray(msg) ? msg[0] : msg || "Checkout failed";
      setServerError(text);
      toast({ title: "Checkout failed", text, severity: "error" });
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
              <TextField fullWidth size="small" defaultValue="4242 4242 4242 4242" sx={{ mb: 1.75 }} slotProps={{ htmlInput: { readOnly: true } }} />
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.75 }}>
                <TextField fullWidth size="small" defaultValue="12 / 28" slotProps={{ htmlInput: { readOnly: true } }} />
                <TextField fullWidth size="small" defaultValue="123" slotProps={{ htmlInput: { readOnly: true } }} />
              </Box>
              <Typography sx={{ fontSize: 12, color: "text.disabled", mt: 1.5 }}>
                Stripe test card — no real charge is made.
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
              <Button type="submit" fullWidth disabled={isLoading || !cart?.items.length} sx={{ py: 1.7 }}>
                {isLoading ? "Processing…" : `Pay ${gbp(cart?.total ?? 0)}`}
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
      <CheckoutInner />
    </Protected>
  );
}
