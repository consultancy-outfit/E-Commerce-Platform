"use client";

import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { statusColors } from "@/src/lib/theme/tokens";

const ORDER: Array<{ key: string; label: string }> = [
  { key: "pending", label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

/** SVG donut chart of orders-by-status (the dashboard's required chart). */
export default function StatusDonut({ data }: { data: Record<string, number> }) {
  const theme = useTheme();
  const total = Object.values(data).reduce((s, n) => s + n, 0) || 1;
  let offset = 0;
  const R = 15.9155; // circumference ≈ 100

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, flexWrap: "wrap" }}>
      <svg width="120" height="120" viewBox="0 0 42 42">
        <circle cx="21" cy="21" r={R} fill="none" stroke={theme.palette.maison.track} strokeWidth="6" />
        {ORDER.map(({ key }) => {
          const value = data[key] ?? 0;
          if (value === 0) return null;
          const pct = (value / total) * 100;
          const seg = (
            <circle
              key={key}
              cx="21"
              cy="21"
              r={R}
              fill="none"
              stroke={statusColors[key]}
              strokeWidth="6"
              strokeDasharray={`${pct} ${100 - pct}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 21 21)"
            />
          );
          offset += pct;
          return seg;
        })}
      </svg>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, fontWeight: 500, fontSize: 12, color: "text.secondary" }}>
        {ORDER.map(({ key, label }) => (
          <Box key={key} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 9, height: 9, borderRadius: 0.5, bgcolor: statusColors[key] }} />
            {label} {data[key] ?? 0}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
