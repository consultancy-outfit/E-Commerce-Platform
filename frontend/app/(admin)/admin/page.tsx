"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import AdminTopbar from "@/src/components/AdminTopbar";
import StatusDonut from "@/src/components/StatusDonut";
import InventoryBarChart from "@/src/components/InventoryBarChart";
import { gbp } from "@/src/lib/format";
import { accents } from "@/src/lib/theme/tokens";
import { useGetAnalyticsQuery } from "@/src/features/admin/adminApi";
import { useGetProductsQuery } from "@/src/features/products/productsApi";

export default function AdminDashboard() {
  const { data, isLoading } = useGetAnalyticsQuery();
  const { data: products } = useGetProductsQuery({ limit: 100, sort: "newest" });

  const avgOrder = data && data.orderCount > 0 ? data.totalSales / data.orderCount : 0;
  const maxUnits = data?.topProducts[0]?.units || 1;

  return (
    <Box>
      <AdminTopbar title="Dashboard" />
      {isLoading || !data ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
          <CircularProgress sx={{ color: "secondary.main" }} />
        </Box>
      ) : (
        <Box sx={{ p: 4 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4,1fr)" }, gap: 2, mb: 3 }}>
            <Kpi label="Total sales" value={gbp(data.totalSales)} />
            <Kpi label="Orders" value={String(data.orderCount)} />
            <Kpi label="Avg. order" value={gbp(avgOrder)} />
            <Kpi label="Delivered" value={String(data.ordersByStatus.delivered ?? 0)} />
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.6fr 1fr" }, gap: 2 }}>
            <Panel title="Top-selling products">
              {data.topProducts.length === 0 ? (
                <Typography sx={{ color: "text.disabled", fontSize: 14 }}>No sales yet.</Typography>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.75 }}>
                  {data.topProducts.map((t) => (
                    <Box key={t.productId} sx={{ display: "flex", alignItems: "center", gap: 1.75 }}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 0.75 }}>{t.name}</Typography>
                        <Box sx={{ height: 6, bgcolor: "maison.surface2", borderRadius: 3, overflow: "hidden" }}>
                          <Box sx={{ height: 6, borderRadius: 3, bgcolor: accents.crimson, width: `${Math.max(6, (t.units / maxUnits) * 100)}%` }} />
                        </Box>
                      </Box>
                      <Typography sx={{ fontWeight: 600, fontSize: 13, color: "text.secondary", width: 64, textAlign: "right" }}>
                        {t.units} sold
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Panel>
            <Panel title="Orders by status">
              <StatusDonut data={data.ordersByStatus} />
            </Panel>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Panel title="Product inventory">
              <InventoryBarChart products={products?.items ?? []} />
            </Panel>
          </Box>
        </Box>
      )}
    </Box>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "maison.line.l10", borderRadius: 2, p: 2.25 }}>
      <Typography sx={{ fontWeight: 500, fontSize: 12, color: "text.disabled", mb: 1 }}>{label}</Typography>
      <Typography variant="h4" sx={{ fontSize: 28 }}>{value}</Typography>
    </Box>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "maison.line.l10", borderRadius: 2, p: 2.75 }}>
      <Typography variant="h5" sx={{ fontSize: 18, mb: 2.25 }}>{title}</Typography>
      {children}
    </Box>
  );
}
