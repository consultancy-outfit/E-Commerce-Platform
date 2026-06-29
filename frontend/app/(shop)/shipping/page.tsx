"use client";

import { Box, Typography } from "@mui/material";
import PageHero from "@/src/components/PageHero";

const ROWS = [
  { name: "Standard", note: "Royal Mail Tracked", time: "3–5 working days", cost: "£5 · Free over £150" },
  { name: "Express", note: "DPD next-working-day", time: "1–2 working days", cost: "£12" },
  { name: "Named day", note: "Choose your delivery date", time: "On your chosen day", cost: "£18" },
  { name: "International", note: "DHL Express, duties included", time: "5–10 working days", cost: "from £20" },
];

const FAQ = [
  { q: "When will my order ship?", a: "Orders placed before 2pm GMT are dispatched the same working day from our Paris atelier. Orders placed afterwards ship the next working day." },
  { q: "Can I track my parcel?", a: "Yes — a tracking link is emailed the moment your order leaves us, with live updates until it reaches your door." },
  { q: "Do you ship internationally?", a: "We deliver to over 60 countries. Duties and taxes are calculated and included at checkout, so there is nothing to pay on arrival." },
];

export default function ShippingPage() {
  return (
    <Box>
      <PageHero
        eyebrow="Maison Care"
        title="Shipping & delivery"
        subtitle="Every order is hand-checked, wrapped in tissue and dispatched from our Paris atelier within 24 hours."
      />
      <Box sx={{ maxWidth: 1000, mx: "auto", px: 5, py: 6 }}>
        <Typography variant="h4" sx={{ fontSize: 24, mb: 2.25 }}>Delivery options</Typography>
        <Box sx={{ border: "1px solid", borderColor: "maison.line.l10", borderRadius: 2, overflow: "hidden", mb: 6 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "1.6fr 1.4fr 1fr", bgcolor: "maison.bgDeep", borderBottom: "1px solid", borderColor: "maison.line.l10", px: 2.75, py: 1.6, fontWeight: 600, fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "text.disabled" }}>
            <span>Method</span><span>Estimated time</span><Box component="span" sx={{ textAlign: "right" }}>Cost</Box>
          </Box>
          {ROWS.map((r) => (
            <Box key={r.name} sx={{ display: "grid", gridTemplateColumns: "1.6fr 1.4fr 1fr", alignItems: "center", px: 2.75, py: 2.25, borderBottom: "1px solid", borderColor: "maison.line.l06" }}>
              <Box>
                <Typography sx={{ fontWeight: 500, fontSize: 15 }}>{r.name}</Typography>
                <Typography sx={{ fontSize: 12, color: "text.disabled" }}>{r.note}</Typography>
              </Box>
              <Typography sx={{ fontSize: 14, color: "text.secondary" }}>{r.time}</Typography>
              <Typography sx={{ fontWeight: 600, fontSize: 14, textAlign: "right" }}>{r.cost}</Typography>
            </Box>
          ))}
        </Box>
        <Typography variant="h4" sx={{ fontSize: 24, mb: 2.25 }}>Frequently asked</Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.75 }}>
          {FAQ.map((f) => (
            <Box key={f.q} sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "maison.line.l08", borderRadius: 2, p: 2.5 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 15, mb: 1 }}>{f.q}</Typography>
              <Typography sx={{ fontSize: 14, lineHeight: 1.65, color: "text.disabled" }}>{f.a}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
