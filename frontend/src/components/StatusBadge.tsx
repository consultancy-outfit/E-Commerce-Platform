"use client";

import { Box } from "@mui/material";
import { statusColors } from "@/src/lib/theme/tokens";

/** Pill badge for order status / product stock state, tinted by status colour. */
export default function StatusBadge({ label }: { label: string }) {
  const c = statusColors[label.toLowerCase()] ?? "#8B867D";
  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        fontWeight: 600,
        fontSize: 10,
        letterSpacing: ".06em",
        textTransform: "uppercase",
        color: c,
        bgcolor: `${c}1f`,
        border: `1px solid ${c}4d`,
        borderRadius: 999,
        px: 1.3,
        py: 0.5,
      }}
    >
      {label}
    </Box>
  );
}
