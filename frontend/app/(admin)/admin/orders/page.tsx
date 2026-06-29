"use client";

import { Box, CircularProgress, MenuItem, Select, Typography } from "@mui/material";
import AdminTopbar from "@/src/components/AdminTopbar";
import { useToast } from "@/src/components/ToastProvider";
import { gbp } from "@/src/lib/format";
import { statusColors } from "@/src/lib/theme/tokens";
import { useGetAdminOrdersQuery, useUpdateOrderStatusMutation } from "@/src/features/admin/adminApi";
import type { OrderStatus } from "@/src/lib/types";

const COLS = "120px 1.4fr 70px 150px 110px 100px";
const STATUSES: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const { data: orders, isLoading } = useGetAdminOrdersQuery();
  const [updateStatus] = useUpdateOrderStatusMutation();
  const toast = useToast();

  const change = async (id: string, status: OrderStatus) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast({ title: "Status updated", text: status, severity: "success" });
    } catch (err) {
      const e = err as { data?: { message?: string } };
      toast({ title: "Invalid transition", text: e.data?.message ?? "Status not changed", severity: "error" });
    }
  };

  return (
    <Box>
      <AdminTopbar title="Orders" />
      {isLoading || !orders ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
          <CircularProgress sx={{ color: "secondary.main" }} />
        </Box>
      ) : (
        <Box sx={{ p: 4 }}>
          <Box sx={{ border: "1px solid", borderColor: "maison.line.l10", borderRadius: 2, overflow: "hidden" }}>
            <Box sx={{ display: "grid", gridTemplateColumns: COLS, bgcolor: "maison.bgDeep", borderBottom: "1px solid", borderColor: "maison.line.l10", px: 2.5, py: 1.6, fontWeight: 600, fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "text.disabled" }}>
              <span>Order</span><span>Customer</span><span>Items</span><span>Status</span><span>Total</span><span>Date</span>
            </Box>
            {orders.map((o) => (
              <Box key={o._id} sx={{ display: "grid", gridTemplateColumns: COLS, alignItems: "center", px: 2.5, py: 1.6, borderBottom: "1px solid", borderColor: "maison.line.l06", fontWeight: 500, fontSize: 14, color: "text.secondary" }}>
                <Box component="span" sx={{ color: "secondary.main", fontWeight: 600 }}>#{o._id.slice(-6).toUpperCase()}</Box>
                <span>{o.shippingAddress.firstName} {o.shippingAddress.lastName}</span>
                <span>{o.items.reduce((s, i) => s + i.quantity, 0)}</span>
                <Select
                  value={o.status}
                  onChange={(e) => change(o._id, e.target.value as OrderStatus)}
                  size="small"
                  sx={{
                    height: 30,
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                    color: statusColors[o.status],
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: `${statusColors[o.status]}66` },
                  }}
                >
                  {STATUSES.map((s) => (
                    <MenuItem key={s} value={s} sx={{ fontSize: 12, textTransform: "capitalize", color: statusColors[s] }}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
                <Box component="span" sx={{ color: "text.primary", fontWeight: 600 }}>{gbp(o.total)}</Box>
                <Box component="span" sx={{ color: "text.disabled" }}>
                  {new Date(o.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </Box>
              </Box>
            ))}
            {orders.length === 0 && (
              <Typography sx={{ p: 4, textAlign: "center", color: "text.disabled" }}>No orders yet.</Typography>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
