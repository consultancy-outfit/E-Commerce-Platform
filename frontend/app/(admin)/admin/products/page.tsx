"use client";

import * as React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AdminTopbar from "@/src/components/AdminTopbar";
import StatusBadge from "@/src/components/StatusBadge";
import ProductFormModal from "@/src/features/admin/ProductFormModal";
import { useToast } from "@/src/components/ToastProvider";
import { imageUrl } from "@/src/lib/api/baseApi";
import { gbp, stockState } from "@/src/lib/format";
import { useGetProductsQuery } from "@/src/features/products/productsApi";
import { useDeleteProductMutation } from "@/src/features/admin/adminApi";
import type { Product } from "@/src/lib/types";

const COLS = "2.4fr 1.2fr 1fr 1fr 1.2fr";

export default function AdminProductsPage() {
  const { data, isLoading } = useGetProductsQuery({ limit: 100, page: 1 });
  const [deleteProduct] = useDeleteProductMutation();
  const toast = useToast();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editProduct, setEditProduct] = React.useState<Product | null>(null);
  const [view, setView] = React.useState<Product | null>(null);

  const openAdd = () => { setEditProduct(null); setFormOpen(true); };
  const openEdit = (p: Product) => { setEditProduct(p); setView(null); setFormOpen(true); };

  const remove = async (p: Product) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(p._id).unwrap();
      setView(null);
      toast({ title: "Product deleted", text: p.name });
    } catch {
      toast({ title: "Could not delete product" });
    }
  };

  return (
    <Box>
      <AdminTopbar
        title="Products"
        action={<Button startIcon={<AddIcon />} onClick={openAdd}>Add product</Button>}
      />

      {isLoading || !data ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
          <CircularProgress sx={{ color: "secondary.main" }} />
        </Box>
      ) : (
        <Box sx={{ p: 4 }}>
          <Box sx={{ border: "1px solid", borderColor: "maison.line.l10", borderRadius: 2, overflow: "hidden" }}>
            <Box sx={{ display: "grid", gridTemplateColumns: COLS, bgcolor: "maison.bgDeep", borderBottom: "1px solid", borderColor: "maison.line.l10", px: 2.5, py: 1.6, fontWeight: 600, fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "text.disabled" }}>
              <span>Product</span><span>Category</span><span>Price</span><span>Stock</span><span>Status</span>
            </Box>
            {data.items.map((p) => {
              const s = stockState(p.stock);
              return (
                <Box
                  key={p._id}
                  onClick={() => setView(p)}
                  sx={{ display: "grid", gridTemplateColumns: COLS, alignItems: "center", px: 2.5, py: 1.5, borderBottom: "1px solid", borderColor: "maison.line.l06", fontWeight: 500, fontSize: 14, color: "text.secondary", cursor: "pointer", "&:hover": { bgcolor: "maison.surface2" } }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box sx={{ width: 38, height: 46, borderRadius: 1, overflow: "hidden", bgcolor: "maison.surfaceImg", flexShrink: 0 }}>
                      {p.image && <Box component="img" src={imageUrl(p.image)} alt={p.name} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                    </Box>
                    <Box component="span" sx={{ color: "text.primary" }}>{p.name}</Box>
                  </Box>
                  <span>{p.category}</span>
                  <Box component="span" sx={{ color: "text.primary" }}>{gbp(p.price)}</Box>
                  <span>{p.stock}</span>
                  <span><StatusBadge label={s.label} /></span>
                </Box>
              );
            })}
            {data.items.length === 0 && (
              <Typography sx={{ p: 4, textAlign: "center", color: "text.disabled" }}>No products yet.</Typography>
            )}
          </Box>
        </Box>
      )}

      <ProductFormModal open={formOpen} onClose={() => setFormOpen(false)} product={editProduct} />

      {/* View modal */}
      <Dialog open={!!view} onClose={() => setView(null)} maxWidth="md" fullWidth slotProps={{ paper: { sx: { borderRadius: 2.5 } } }}>
        {view && (
          <>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, py: 2.25, borderBottom: "1px solid", borderColor: "maison.line.l08" }}>
              <Typography variant="h5" sx={{ fontSize: 20 }}>Product details</Typography>
              <IconButton onClick={() => setView(null)} sx={{ color: "text.disabled" }}><CloseIcon /></IconButton>
            </Box>
            <Box sx={{ display: "flex", gap: 3, p: 3, flexWrap: { xs: "wrap", sm: "nowrap" } }}>
              <Box sx={{ width: 240, flexShrink: 0, aspectRatio: "4/5", borderRadius: 2, overflow: "hidden", bgcolor: "maison.surfaceImg" }}>
                {view.image && <Box component="img" src={imageUrl(view.image)} alt={view.name} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 1.25 }}>
                  <Typography sx={{ fontWeight: 500, fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "secondary.main" }}>{view.category}</Typography>
                  <StatusBadge label={stockState(view.stock).label} />
                </Box>
                <Typography variant="h4" sx={{ fontSize: 26, mb: 0.75 }}>{view.name}</Typography>
                <Typography sx={{ fontSize: 22, mb: 2.5 }}>{gbp(view.price)}</Typography>
                <Box sx={{ display: "flex", gap: 4, mb: 2.5 }}>
                  <Detail label="SKU" value={`PRD-${view._id.slice(-4).toUpperCase()}`} />
                  <Detail label="In stock" value={String(view.stock)} />
                </Box>
                <Typography sx={{ fontWeight: 500, fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "text.disabled", mb: 0.9 }}>Description</Typography>
                <Typography sx={{ fontSize: 14, lineHeight: 1.7, color: "text.secondary" }}>{view.description || "No description provided."}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 3, py: 2, borderTop: "1px solid", borderColor: "maison.line.l08" }}>
              <Button variant="outlined" startIcon={<DeleteIcon />} onClick={() => remove(view)} sx={{ color: "error.main", borderColor: "error.main" }}>
                Delete
              </Button>
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Button variant="outlined" onClick={() => setView(null)} sx={{ color: "text.primary" }}>Close</Button>
                <Button onClick={() => openEdit(view)}>Edit product</Button>
              </Box>
            </Box>
          </>
        )}
      </Dialog>
    </Box>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography sx={{ fontWeight: 500, fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "text.disabled", mb: 0.5 }}>{label}</Typography>
      <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{value}</Typography>
    </Box>
  );
}
