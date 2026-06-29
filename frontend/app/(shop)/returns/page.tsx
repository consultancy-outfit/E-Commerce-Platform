"use client";

import { Box, Typography } from "@mui/material";
import PageHero from "@/src/components/PageHero";
import { accents } from "@/src/lib/theme/tokens";

const STEPS = [
  { n: "1", title: "Request a return", body: "Open the order in your account and select the pieces you would like to send back within 30 days of delivery." },
  { n: "2", title: "Pack it up", body: "Reuse the original packaging and attach the prepaid, pre-addressed returns label we email to you." },
  { n: "3", title: "Drop it off", body: "Leave it at any partner drop-off point or book a free collection. We will email you once it arrives." },
];
const ELIGIBLE = ["Unworn, unwashed items with original tags", "Returned within 30 days of delivery", "Footwear in its original undamaged box", "Faulty or incorrectly sent pieces — always"];
const INELIGIBLE = ["Final-sale and archive-sale items", "Pierced jewellery & earrings, for hygiene", "Items without their original tags", "Made-to-order or monogrammed pieces"];

export default function ReturnsPage() {
  return (
    <Box>
      <PageHero
        eyebrow="Maison Care"
        title="Returns & exchanges"
        subtitle="Not quite right? You have 30 days to return or exchange — return shipping is always free."
      />
      <Box sx={{ maxWidth: 1000, mx: "auto", px: 5, py: 6 }}>
        <Typography variant="h4" sx={{ fontSize: 24, mb: 2.5 }}>How it works</Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3,1fr)" }, gap: 2, mb: 6 }}>
          {STEPS.map((s) => (
            <Box key={s.n} sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "maison.line.l10", borderRadius: 2, p: 3 }}>
              <Box sx={{ width: 34, height: 34, borderRadius: "50%", border: `1px solid ${accents.gold}`, color: accents.gold, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-marcellus)", mb: 2 }}>
                {s.n}
              </Box>
              <Typography sx={{ fontWeight: 500, fontSize: 15, mb: 0.9 }}>{s.title}</Typography>
              <Typography sx={{ fontSize: 13, lineHeight: 1.6, color: "text.disabled" }}>{s.body}</Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
          <Panel title="Eligible for return" color={accents.success} items={ELIGIBLE} />
          <Panel title="Cannot be accepted" color={accents.error} items={INELIGIBLE} />
        </Box>
      </Box>
    </Box>
  );
}

function Panel({ title, color, items }: { title: string; color: string; items: string[] }) {
  return (
    <Box sx={{ bgcolor: "background.paper", border: `1px solid ${color}38`, borderRadius: 2, p: 3 }}>
      <Typography variant="h5" sx={{ fontSize: 18, mb: 2 }}>{title}</Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.4 }}>
        {items.map((i) => (
          <Box key={i} sx={{ display: "flex", gap: 1.25, fontSize: 14, lineHeight: 1.5, color: "text.secondary" }}>
            <Box component="span" sx={{ color }}>·</Box>
            {i}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
