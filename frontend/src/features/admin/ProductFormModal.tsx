"use client";

import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UploadIcon from "@mui/icons-material/FileUploadOutlined";
import { CATEGORIES, type Product } from "@/src/lib/types";
import { useToast } from "@/src/components/ToastProvider";
import { useCreateProductMutation, useUpdateProductMutation } from "./adminApi";

interface Props {
  open: boolean;
  onClose: () => void;
  product?: Product | null; // present = edit
}

export default function ProductFormModal({ open, onClose, product }: Props) {
  const toast = useToast();
  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
  const editing = !!product;

  const [form, setForm] = React.useState({ name: "", category: "Dresses", price: "", stock: "", image: "", description: "" });
  const [file, setFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setError(null);
      setFile(null);
      setForm(
        product
          ? {
              name: product.name,
              category: product.category,
              price: String(product.price),
              stock: String(product.stock),
              image: product.image ?? "",
              description: product.description ?? "",
            }
          : { name: "", category: "Dresses", price: "", stock: "", image: "", description: "" },
      );
    }
  }, [open, product]);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setError(null);
    if (!form.name.trim() || form.price === "" || isNaN(Number(form.price))) {
      setError("Please enter a product name and a valid price.");
      return;
    }
    const fd = new FormData();
    fd.append("name", form.name.trim());
    fd.append("category", form.category);
    fd.append("price", String(Number(form.price)));
    fd.append("stock", String(form.stock === "" ? 0 : Number(form.stock)));
    if (form.description.trim()) fd.append("description", form.description.trim());
    if (file) fd.append("image", file);
    else if (form.image.trim()) fd.append("image", form.image.trim());

    try {
      if (editing && product) {
        await updateProduct({ id: product._id, body: fd }).unwrap();
        toast({ title: "Product updated", text: form.name, severity: "success" });
      } else {
        await createProduct(fd).unwrap();
        toast({ title: "Product added", text: form.name, severity: "success" });
      }
      onClose();
    } catch (err) {
      const e = err as { data?: { message?: string | string[] } };
      const msg = e.data?.message;
      const text = Array.isArray(msg) ? msg[0] : msg || "Could not save product";
      setError(text);
      toast({ title: "Couldn't save product", text, severity: "error" });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 2.5 } } }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, py: 2.25, borderBottom: "1px solid", borderColor: "maison.line.l08" }}>
        <Typography variant="h5" sx={{ fontSize: 20 }}>{editing ? "Edit product" : "Add product"}</Typography>
        <IconButton onClick={onClose} sx={{ color: "text.disabled" }}><CloseIcon /></IconButton>
      </Box>

      <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        <Field label="Product name">
          <TextField fullWidth size="small" placeholder="e.g. Linen blazer" value={form.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.75 }}>
          <Field label="Category">
            <TextField select fullWidth size="small" value={form.category} onChange={(e) => set("category", e.target.value)}>
              {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
          </Field>
          <Field label="Price (£)">
            <TextField fullWidth size="small" type="number" placeholder="0" value={form.price} onChange={(e) => set("price", e.target.value)} />
          </Field>
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.75 }}>
          <Field label="Stock">
            <TextField fullWidth size="small" type="number" placeholder="0" value={form.stock} onChange={(e) => set("stock", e.target.value)} />
          </Field>
          <Field
            label="Image (URL or upload)"
            action={
              <Button component="label" size="small" startIcon={<UploadIcon sx={{ fontSize: 14 }} />} sx={{ p: 0, minWidth: 0, color: "secondary.main", bgcolor: "transparent", "&:hover": { bgcolor: "transparent" } }}>
                Upload
                <input type="file" accept="image/*" hidden onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              </Button>
            }
          >
            <TextField fullWidth size="small" placeholder="https://… or upload" value={file ? file.name : form.image} disabled={!!file} onChange={(e) => set("image", e.target.value)} />
          </Field>
        </Box>
        <Field label="Description">
          <TextField fullWidth multiline minRows={3} placeholder="Short description of the piece" value={form.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
        {error && <Typography sx={{ color: "error.main", fontSize: 13 }}>{error}</Typography>}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, px: 3, py: 2, borderTop: "1px solid", borderColor: "maison.line.l08" }}>
        <Button variant="outlined" onClick={onClose} sx={{ color: "text.primary" }}>Cancel</Button>
        <Button onClick={save} disabled={creating || updating}>{editing ? "Save changes" : "Add product"}</Button>
      </Box>
    </Dialog>
  );
}

function Field({ label, action, children }: { label: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.8 }}>
        <Typography sx={{ fontWeight: 500, fontSize: 12, color: "text.secondary" }}>{label}</Typography>
        {action}
      </Box>
      {children}
    </Box>
  );
}
