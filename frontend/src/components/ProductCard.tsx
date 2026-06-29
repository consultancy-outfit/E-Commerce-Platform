"use client";

import { useRouter } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { imageUrl } from "@/src/lib/api/baseApi";
import { price, stockState } from "@/src/lib/format";
import { statusColors } from "@/src/lib/theme/tokens";
import type { Product } from "@/src/lib/types";

/** Catalog/recommendation product tile matching the prototype. */
export default function ProductCard({ product, showStock = true }: { product: Product; showStock?: boolean }) {
  const router = useRouter();
  const stock = stockState(product.stock);

  return (
    <Box
      component={motion.div}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={() => router.push(`/product/${product._id}`)}
      sx={{ cursor: "pointer" }}
    >
      <Box
        sx={{
          aspectRatio: "3 / 4",
          borderRadius: 1.5,
          overflow: "hidden",
          bgcolor: "maison.surfaceImg",
          mb: 1.5,
        }}
      >
        {product.image && (
          <Box
            component="img"
            src={imageUrl(product.image)}
            alt={product.name}
            sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        )}
      </Box>
      <Typography
        sx={{ fontWeight: 500, fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "text.disabled", mb: 0.5 }}
      >
        {product.category}
      </Typography>
      <Typography variant="h6" sx={{ fontSize: 16, mb: 0.6 }}>
        {product.name}
      </Typography>
      <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{price(product.price)}</Typography>
      {showStock && (
        <Typography sx={{ fontWeight: 500, fontSize: 11, mt: 0.6, color: statusColors[stock.key] }}>
          {stock.label}
        </Typography>
      )}
    </Box>
  );
}
