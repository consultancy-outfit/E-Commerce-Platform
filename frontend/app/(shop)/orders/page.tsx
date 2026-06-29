"use client";

import { useRouter } from "next/navigation";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import Protected from "@/src/components/Protected";
import StatusBadge from "@/src/components/StatusBadge";
import { gbp } from "@/src/lib/format";
import { useGetMyOrdersQuery } from "@/src/features/orders/ordersApi";

function OrdersInner() {
  const router = useRouter();
  const { data: orders, isLoading } = useGetMyOrdersQuery();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
        <CircularProgress sx={{ color: "secondary.main" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 5 }}>
      <Typography variant="h3" sx={{ fontSize: 32, mb: 3 }}>
        Order history
      </Typography>

      {!orders || orders.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography sx={{ color: "text.disabled", mb: 3 }}>You have no orders yet.</Typography>
          <Button onClick={() => router.push("/catalog")}>Browse the collection</Button>
        </Box>
      ) : (
        orders.map((o) => (
          <Box key={o._id} sx={{ border: "1px solid", borderColor: "maison.line.l10", borderRadius: 2, p: 2.75, mb: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 2, borderBottom: "1px solid", borderColor: "maison.line.l08", mb: 2 }}>
              <Box sx={{ display: "flex", gap: 3.5, flexWrap: "wrap" }}>
                <Field label="Order" value={`#${o._id.slice(-6).toUpperCase()}`} />
                <Field label="Placed" value={new Date(o.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} />
                <Field label="Total" value={gbp(o.total)} />
              </Box>
              <StatusBadge label={o.status} />
            </Box>
            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
              {o.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}
            </Typography>
          </Box>
        ))
      )}
    </Box>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography sx={{ fontWeight: 500, fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "text.disabled" }}>
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 600, fontSize: 15 }}>{value}</Typography>
    </Box>
  );
}

export default function OrdersPage() {
  return (
    <Protected>
      <OrdersInner />
    </Protected>
  );
}
