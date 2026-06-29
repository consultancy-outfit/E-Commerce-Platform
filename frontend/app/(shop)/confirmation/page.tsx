"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Button, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import Protected from "@/src/components/Protected";
import { accents } from "@/src/lib/theme/tokens";
import { useAppSelector } from "@/src/lib/hooks";
import { useGetMyOrderQuery } from "@/src/features/orders/ordersApi";

function ConfirmationInner() {
  const router = useRouter();
  const id = useSearchParams().get("id") ?? "";
  const firstName = useAppSelector((s) => s.auth.user?.firstName);
  const { data: order } = useGetMyOrderQuery(id, { skip: !id });

  return (
    <Box sx={{ py: 7.5, px: 5, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
      <Box sx={{ width: 72, height: 72, borderRadius: "50%", bgcolor: `${accents.success}1f`, border: `1px solid ${accents.success}66`, display: "flex", alignItems: "center", justifyContent: "center", mb: 3 }}>
        <CheckIcon sx={{ fontSize: 34, color: accents.success }} />
      </Box>
      <Typography sx={{ fontWeight: 500, fontSize: 11, letterSpacing: ".3em", textTransform: "uppercase", color: "secondary.main", mb: 1.5 }}>
        Order confirmed
      </Typography>
      <Typography variant="h2" sx={{ fontSize: 40, mb: 1.5 }}>
        Thank you{firstName ? `, ${firstName}` : ""}.
      </Typography>
      <Typography sx={{ fontSize: 15, color: "text.secondary", maxWidth: 440, mb: 1 }}>
        Order <Box component="span" sx={{ color: "text.primary", fontWeight: 600 }}>#{id.slice(-6).toUpperCase()}</Box>{" "}
        is confirmed{order ? ` — total ${"£" + order.total.toFixed(2)}` : ""}. A receipt is on its way to your inbox.
      </Typography>
      <Typography sx={{ fontSize: 13, color: "text.disabled", mb: 4.5 }}>
        Estimated delivery · 3–5 working days
      </Typography>
      <Box sx={{ display: "flex", gap: 1.5 }}>
        <Button onClick={() => router.push("/orders")} sx={{ bgcolor: "text.primary", color: "background.default", "&:hover": { bgcolor: "text.secondary" } }}>
          View orders
        </Button>
        <Button variant="outlined" onClick={() => router.push("/catalog")}>
          Continue shopping
        </Button>
      </Box>
    </Box>
  );
}

export default function ConfirmationPage() {
  return (
    <Protected>
      <Suspense fallback={null}>
        <ConfirmationInner />
      </Suspense>
    </Protected>
  );
}
