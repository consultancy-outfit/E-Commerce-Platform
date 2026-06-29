"use client";

import { Box, Tooltip, Typography } from "@mui/material";
import { accents } from "@/src/lib/theme/tokens";
import type { Product } from "@/src/lib/types";

const PLOT_H = 220; // plot area height (px)
const TICKS = 4;

/** Colour a bar by stock health, reusing the app's stock semantics. */
function barColor(stock: number): string {
  if (stock <= 0) return accents.error;
  if (stock <= 3) return accents.warning;
  return accents.crimson;
}

/**
 * Responsive inventory bar chart: products on the X-axis, stock on the Y-axis.
 * Custom (no chart lib) to match the dashboard's existing bespoke charts —
 * theme tokens, hairline gridlines, hover tooltips. Scrolls horizontally on
 * small screens so labels stay legible.
 */
export default function InventoryBarChart({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <Typography sx={{ color: "text.disabled", fontSize: 14 }}>No products to display.</Typography>;
  }

  const max = Math.max(1, ...products.map((p) => p.stock));
  // Y-axis tick values from top (max) to bottom (0).
  const ticks = Array.from({ length: TICKS + 1 }, (_, i) => Math.round((max * (TICKS - i)) / TICKS));
  const minColWidth = 44;

  return (
    <Box>
      <Typography sx={{ fontSize: 13, color: "text.disabled", mb: 2.5 }}>Units in stock by product</Typography>

      <Box sx={{ display: "flex" }}>
        {/* Y-axis label + tick values */}
        <Box sx={{ display: "flex", flexShrink: 0 }}>
          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: "text.disabled",
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              alignSelf: "center",
              mr: 0.5,
            }}
          >
            Units in stock
          </Typography>
          <Box sx={{ position: "relative", width: 28, height: PLOT_H }}>
            {ticks.map((t, i) => (
              <Typography
                key={i}
                sx={{ position: "absolute", right: 4, top: `${(i / TICKS) * PLOT_H - 7}px`, fontSize: 10, color: "text.disabled" }}
              >
                {t}
              </Typography>
            ))}
          </Box>
        </Box>

        {/* Scrollable plot */}
        <Box sx={{ flex: 1, overflowX: "auto", pb: 0.5 }}>
          <Box sx={{ minWidth: products.length * minColWidth }}>
            {/* plot area with gridlines + bars */}
            <Box sx={{ position: "relative", height: PLOT_H, borderBottom: "1px solid", borderColor: "maison.line.l14" }}>
              {ticks.map((_, i) => (
                <Box
                  key={i}
                  sx={{ position: "absolute", left: 0, right: 0, top: `${(i / TICKS) * PLOT_H}px`, borderTop: "1px solid", borderColor: "maison.line.l06" }}
                />
              ))}
              <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", gap: 1, px: 0.5 }}>
                {products.map((p) => {
                  const color = barColor(p.stock);
                  return (
                    <Tooltip key={p._id} title={`${p.name} · ${p.stock} in stock`} arrow placement="top">
                      <Box
                        sx={{
                          flex: 1,
                          minWidth: minColWidth - 8,
                          height: `${(p.stock / max) * 100}%`,
                          minHeight: 3,
                          bgcolor: color,
                          borderRadius: "4px 4px 0 0",
                          cursor: "pointer",
                          transition: "opacity .15s",
                          "&:hover": { opacity: 0.82 },
                        }}
                      />
                    </Tooltip>
                  );
                })}
              </Box>
            </Box>

            {/* X-axis product labels */}
            <Box sx={{ display: "flex", gap: 1, px: 0.5, mt: 1 }}>
              {products.map((p) => (
                <Typography
                  key={p._id}
                  title={p.name}
                  sx={{
                    flex: 1,
                    minWidth: minColWidth - 8,
                    fontSize: 10,
                    color: "text.disabled",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {p.name}
                </Typography>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      <Typography sx={{ fontSize: 10, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "text.disabled", textAlign: "center", mt: 1.5 }}>
        Products
      </Typography>
    </Box>
  );
}
