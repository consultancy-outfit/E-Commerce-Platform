"use client";

import NextLink from "next/link";
import { Box, Typography } from "@mui/material";

export default function StorefrontFooter() {
  return (
    <Box
      sx={{
        // Full-width top divider; content pushed to the screen edges.
        borderTop: "1px solid",
        borderColor: "maison.line.l08",
        px: { xs: 3, sm: 5 },
        py: 3.5,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      <Typography sx={{ fontWeight: 600, fontSize: 11, letterSpacing: ".32em", color: "text.disabled" }}>
        MAISON © 2026
      </Typography>
      <Box sx={{ display: "flex", gap: 3, fontWeight: 500, fontSize: 13 }}>
        {[
          ["Shipping", "/shipping"],
          ["Returns", "/returns"],
          ["Contact", "/contact"],
        ].map(([label, href]) => (
          <Box
            key={href}
            component={NextLink}
            href={href}
            sx={{ color: "text.disabled", "&:hover": { color: "text.secondary" } }}
          >
            {label}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
