"use client";

import { Box, Typography } from "@mui/material";
import { accents } from "@/src/lib/theme/tokens";

/** The Maison "M" monogram + wordmark, used in headers and auth screens. */
export default function Logo({
  size = 30,
  letterSpacing = ".32em",
  onClick,
}: {
  size?: number;
  letterSpacing?: string;
  onClick?: () => void;
}) {
  return (
    <Box
      onClick={onClick}
      sx={{ display: "flex", alignItems: "center", gap: 1.25, cursor: onClick ? "pointer" : "default" }}
    >
      <Box
        sx={{
          width: size,
          height: size,
          border: `1px solid ${accents.gold}`,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: accents.gold,
          fontFamily: "var(--font-marcellus), serif",
          fontSize: size * 0.5,
        }}
      >
        M
      </Box>
      <Typography sx={{ fontWeight: 600, fontSize: 12, letterSpacing, color: "text.primary" }}>
        MAISON
      </Typography>
    </Box>
  );
}
