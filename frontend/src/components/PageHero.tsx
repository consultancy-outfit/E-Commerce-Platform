"use client";

import { Box, Typography } from "@mui/material";

/** Reusable banner for the static content pages, matching the prototype hero. */
export default function PageHero({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <Box
      sx={{
        height: 200,
        px: 7,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        borderBottom: "1px solid",
        borderColor: "maison.line.l08",
        background: (t) =>
          `radial-gradient(120% 140% at 78% 20%, rgba(200,32,63,.22), rgba(200,32,63,0) 55%), linear-gradient(120deg, ${t.palette.maison.heroA}, ${t.palette.maison.heroB})`,
      }}
    >
      <Typography sx={{ fontWeight: 500, fontSize: 11, letterSpacing: ".3em", textTransform: "uppercase", color: "secondary.main", mb: 1.5 }}>
        {eyebrow}
      </Typography>
      <Typography variant="h1" sx={{ fontSize: 42, mb: 1.25 }}>
        {title}
      </Typography>
      <Typography sx={{ color: "text.secondary", maxWidth: 520 }}>{subtitle}</Typography>
    </Box>
  );
}
