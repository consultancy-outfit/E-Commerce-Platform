"use client";

import { useRouter } from "next/navigation";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBagOutlined";
import Protected from "@/src/components/Protected";
import { imageUrl } from "@/src/lib/api/baseApi";
import { gbp } from "@/src/lib/format";
import {
  useGetCartQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from "@/src/features/cart/cartApi";

function CartInner() {
  const router = useRouter();
  const { data: cart, isLoading } = useGetCartQuery();
  const [updateItem] = useUpdateCartItemMutation();
  const [removeItem] = useRemoveCartItemMutation();

  if (isLoading || !cart) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
        <CircularProgress sx={{ color: "secondary.main" }} />
      </Box>
    );
  }

  if (cart.items.length === 0) {
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 5 }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", py: 10 }}>
          <Box sx={{ width: 64, height: 64, borderRadius: "50%", bgcolor: "maison.surfaceImg", border: "1px solid", borderColor: "maison.line.l10", display: "flex", alignItems: "center", justifyContent: "center", mb: 2.75 }}>
            <ShoppingBagIcon sx={{ color: "text.disabled" }} />
          </Box>
          <Typography variant="h4" sx={{ fontSize: 24, mb: 1 }}>
            Your bag is empty
          </Typography>
          <Typography sx={{ color: "text.disabled", mb: 3 }}>Explore new arrivals to get started.</Typography>
          <Button onClick={() => router.push("/catalog")}>Browse the collection</Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 5 }}>
      <Box sx={{ display: "flex", gap: 6, flexWrap: { xs: "wrap", md: "nowrap" } }}>
        <Box sx={{ flex: 1, minWidth: 300 }}>
          <Typography variant="h3" sx={{ fontSize: 34, mb: 0.75 }}>
            Your bag
          </Typography>
          <Typography sx={{ color: "text.disabled", mb: 3.5 }}>
            {cart.count} {cart.count === 1 ? "item" : "items"}
          </Typography>

          {cart.items.map((line) => (
            <Box
              key={`${line.productId}-${line.size}`}
              sx={{ display: "flex", gap: 2.5, pb: 3, borderBottom: "1px solid", borderColor: "maison.line.l08", mb: 3 }}
            >
              <Box sx={{ width: 96, height: 120, borderRadius: 1.5, overflow: "hidden", bgcolor: "maison.surfaceImg", flexShrink: 0 }}>
                {line.product.image && (
                  <Box component="img" src={imageUrl(line.product.image)} alt={line.product.name} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                )}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontSize: 18, mb: 0.6 }}>
                  {line.product.name}
                </Typography>
                <Typography sx={{ fontSize: 13, color: "text.disabled", mb: 2 }}>
                  {line.product.category} · Size {line.size}
                </Typography>
                <Box sx={{ display: "inline-flex", alignItems: "center", border: "1px solid", borderColor: "maison.line.l18", borderRadius: 1, overflow: "hidden" }}>
                  <Box
                    component="button"
                    onClick={() => updateItem({ productId: line.productId, size: line.size, quantity: line.quantity - 1 })}
                    sx={{ width: 34, height: 36, bgcolor: "maison.surface2", border: "none", color: "text.secondary", cursor: "pointer" }}
                  >
                    −
                  </Box>
                  <Box sx={{ width: 40, textAlign: "center", fontWeight: 600, fontSize: 14 }}>{line.quantity}</Box>
                  <Box
                    component="button"
                    onClick={() => updateItem({ productId: line.productId, size: line.size, quantity: line.quantity + 1 })}
                    sx={{ width: 34, height: 36, bgcolor: "maison.surface2", border: "none", color: "text.secondary", cursor: "pointer" }}
                  >
                    +
                  </Box>
                </Box>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography sx={{ fontWeight: 600, fontSize: 16, mb: 1.75 }}>{gbp(line.lineTotal)}</Typography>
                <Typography
                  onClick={() => removeItem({ productId: line.productId, size: line.size })}
                  sx={{ fontWeight: 500, fontSize: 12, color: "text.disabled", textDecoration: "underline", cursor: "pointer" }}
                >
                  Remove
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Box sx={{ width: { xs: "100%", md: 360 }, flexShrink: 0 }}>
          <Box sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "maison.line.l10", borderRadius: 2, p: 3.25 }}>
            <Typography variant="h5" sx={{ fontSize: 20, mb: 2.5 }}>
              Order summary
            </Typography>
            <Row label="Subtotal" value={gbp(cart.subtotal)} />
            <Row label="Shipping" value="Free" valueColor="success.main" />
            <Row label="Estimated tax" value={gbp(cart.tax)} />
            <Box sx={{ height: "1px", bgcolor: "maison.line.l10", my: 2.25 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 2.75 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 15 }}>Total</Typography>
              <Typography variant="h5" sx={{ fontSize: 26 }}>{gbp(cart.total)}</Typography>
            </Box>
            <Button fullWidth onClick={() => router.push("/checkout")} sx={{ mb: 1.5, py: 1.7 }}>
              Proceed to checkout
            </Button>
            <Typography onClick={() => router.push("/catalog")} sx={{ textAlign: "center", fontWeight: 500, fontSize: 13, color: "text.disabled", cursor: "pointer" }}>
              Continue shopping
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Row({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "text.secondary", mb: 1.5 }}>
      <span>{label}</span>
      <Box component="span" sx={{ color: valueColor }}>{value}</Box>
    </Box>
  );
}

export default function CartPage() {
  return (
    <Protected>
      <CartInner />
    </Protected>
  );
}
