"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBagOutlined";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import ProductCard from "@/src/components/ProductCard";
import StatusBadge from "@/src/components/StatusBadge";
import { useToast } from "@/src/components/ToastProvider";
import { imageUrl } from "@/src/lib/api/baseApi";
import { gbp } from "@/src/lib/format";
import { stockState } from "@/src/lib/format";
import { useAppSelector } from "@/src/lib/hooks";
import {
  useGetProductQuery,
  useGetRecommendationsQuery,
} from "@/src/features/products/productsApi";
import { useAddCartItemMutation } from "@/src/features/cart/cartApi";

const SIZES = ["XS", "S", "M", "L"];

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const token = useAppSelector((s) => s.auth.token);

  const { data: product, isLoading } = useGetProductQuery(id);
  const { data: recommended } = useGetRecommendationsQuery(id);
  const [addItem, { isLoading: adding }] = useAddCartItemMutation();

  const [size, setSize] = React.useState("S");
  const [qty, setQty] = React.useState(1);

  if (isLoading || !product) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
        <CircularProgress sx={{ color: "secondary.main" }} />
      </Box>
    );
  }

  const stock = stockState(product.stock);
  const soldOut = product.stock <= 0;

  const handleAdd = async () => {
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      await addItem({ productId: product._id, size, quantity: qty }).unwrap();
      toast({ title: "Added to bag", text: `${product.name} · Size ${size}`, actionLabel: "View", onAction: () => router.push("/cart") });
    } catch (err) {
      const e = err as { data?: { message?: string } };
      toast({ title: "Could not add to bag", text: e.data?.message ?? "Please try again" });
    }
  };

  return (
    <Box sx={{ maxWidth: 1440, mx: "auto" }}>
      <Box sx={{ px: 5, py: 2.5, fontSize: 13, color: "text.disabled" }}>
        <Box component="span" sx={{ cursor: "pointer" }} onClick={() => router.push("/catalog")}>
          Home
        </Box>{" "}
        / {product.category} / <Box component="span" sx={{ color: "text.secondary" }}>{product.name}</Box>
      </Box>

      <Box sx={{ display: "flex", gap: 6, px: 5, pb: 7, flexWrap: { xs: "wrap", md: "nowrap" } }}>
        <Box
          sx={{
            flex: 1,
            minWidth: 280,
            aspectRatio: "4 / 5",
            borderRadius: 2,
            overflow: "hidden",
            bgcolor: "maison.surfaceImg",
          }}
        >
          {product.image && (
            <Box component="img" src={imageUrl(product.image)} alt={product.name} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
          )}
        </Box>

        <Box sx={{ width: { xs: "100%", md: 440 }, flexShrink: 0 }}>
          <Typography sx={{ fontWeight: 500, fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "secondary.main", mb: 1.25 }}>
            {product.category}
          </Typography>
          <Typography variant="h2" sx={{ fontSize: 38, mb: 1.75 }}>
            {product.name}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.75, mb: 2.75 }}>
            <Typography sx={{ fontSize: 24 }}>{gbp(product.price)}</Typography>
            <StatusBadge label={stock.label} />
          </Box>
          <Typography sx={{ fontSize: 15, lineHeight: 1.7, color: "text.secondary", mb: 3.25 }}>
            {product.description}
          </Typography>

          <Typography sx={{ fontWeight: 600, fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "text.disabled", mb: 1.4 }}>
            Size
          </Typography>
          <Box sx={{ display: "flex", gap: 1.1, mb: 3.5 }}>
            {SIZES.map((s) => {
              const on = size === s;
              return (
                <Box
                  key={s}
                  onClick={() => setSize(s)}
                  sx={{
                    width: 48,
                    height: 44,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 1,
                    cursor: "pointer",
                    fontWeight: 500,
                    fontSize: 14,
                    border: "1px solid",
                    borderColor: on ? "text.primary" : "maison.line.l18",
                    color: on ? "text.primary" : "text.secondary",
                  }}
                >
                  {s}
                </Box>
              );
            })}
          </Box>

          <Box sx={{ display: "flex", gap: 1.5, mb: 2.25 }}>
            <Box sx={{ display: "inline-flex", alignItems: "center", border: "1px solid", borderColor: "maison.line.l18", borderRadius: 1, overflow: "hidden" }}>
              <Box
                component="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                sx={{ width: 46, height: 52, bgcolor: "maison.surface2", border: "none", color: "text.secondary", fontSize: 20, cursor: "pointer" }}
              >
                −
              </Box>
              <Box sx={{ width: 50, textAlign: "center", fontWeight: 600, fontSize: 16 }}>{qty}</Box>
              <Box
                component="button"
                onClick={() => setQty((q) => Math.min(product.stock || 1, q + 1))}
                sx={{ width: 46, height: 52, bgcolor: "maison.surface2", border: "none", color: "text.secondary", fontSize: 20, cursor: "pointer" }}
              >
                +
              </Box>
            </Box>
            <Button
              onClick={handleAdd}
              disabled={soldOut || adding}
              startIcon={<ShoppingBagIcon />}
              sx={{ flex: 1 }}
            >
              {soldOut ? "Sold out" : adding ? "Adding…" : "Add to cart"}
            </Button>
          </Box>
        </Box>
      </Box>

      {recommended && recommended.length > 0 && (
        <Box sx={{ borderTop: "1px solid", borderColor: "maison.line.l08", px: 5, py: 6, bgcolor: "maison.bgDeep" }}>
          <Typography variant="h3" sx={{ fontSize: 26, mb: 0.5 }}>
            Recommended for you
          </Typography>
          <Typography sx={{ fontSize: 13, color: "text.disabled", mb: 3 }}>
            Same category &amp; price band, weighted by what you&apos;ve browsed.
          </Typography>
          <Swiper spaceBetween={24} slidesPerView={1.2} breakpoints={{ 600: { slidesPerView: 2.2 }, 900: { slidesPerView: 4 } }}>
            {recommended.map((p) => (
              <SwiperSlide key={p._id}>
                <ProductCard product={p} showStock={false} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      )}
    </Box>
  );
}
