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
import ImageIcon from "@mui/icons-material/ImageOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { CATEGORIES, type Product } from "@/src/lib/types";
import { useToast } from "@/src/components/ToastProvider";
import { imageUrl } from "@/src/lib/api/baseApi";
import { accents } from "@/src/lib/theme/tokens";
import { useCreateProductMutation, useUpdateProductMutation } from "./adminApi";

interface Props {
  open: boolean;
  onClose: () => void;
  product?: Product | null; // present = edit
}

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export default function ProductFormModal({ open, onClose, product }: Props) {
  const toast = useToast();
  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
  const editing = !!product;

  const [form, setForm] = React.useState({ name: "", category: "Dresses", price: "", stock: "", description: "" });
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [imageCleared, setImageCleared] = React.useState(false);
  const [dragActive, setDragActive] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const objectUrl = React.useRef<string | null>(null);

  const revokeObjectUrl = () => {
    if (objectUrl.current) {
      URL.revokeObjectURL(objectUrl.current);
      objectUrl.current = null;
    }
  };

  /* eslint-disable react-hooks/set-state-in-effect -- reset the form state when the modal opens or the edited product changes */
  React.useEffect(() => {
    if (open) {
      revokeObjectUrl();
      setError(null);
      setFile(null);
      setImageCleared(false);
      setDragActive(false);
      setForm(
        product
          ? {
              name: product.name,
              category: product.category,
              price: String(product.price),
              stock: String(product.stock),
              description: product.description ?? "",
            }
          : { name: "", category: "Dresses", price: "", stock: "", description: "" },
      );
      setPreview(product?.image ? imageUrl(product.image) : null);
    }
  }, [open, product]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Clean up any object URL when the modal unmounts.
  React.useEffect(() => () => revokeObjectUrl(), []);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleFile = (f?: File | null) => {
    if (!f) return;
    if (!ALLOWED.includes(f.type)) {
      setError("Please upload a JPG, PNG or WebP image.");
      toast({ title: "Unsupported file", text: "Use a JPG, PNG or WebP image.", severity: "error" });
      return;
    }
    setError(null);
    revokeObjectUrl();
    const url = URL.createObjectURL(f);
    objectUrl.current = url;
    setFile(f);
    setPreview(url);
    setImageCleared(false);
  };

  const removeImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    revokeObjectUrl();
    setFile(null);
    setPreview(null);
    setImageCleared(true);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

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
    // Image: new upload wins; an explicit removal clears it; otherwise keep as-is.
    if (file) fd.append("image", file);
    else if (imageCleared) fd.append("image", "");

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
        {/* Drag & drop image uploader (top of the form) */}
        <Field label="Product image">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          {preview ? (
            <Box
              sx={{
                position: "relative",
                borderRadius: 1.5,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "maison.line.l14",
                bgcolor: "maison.surfaceImg",
              }}
            >
              <Box component="img" src={preview} alt="Product preview" sx={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
              <Box sx={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 1 }}>
                <Button
                  size="small"
                  startIcon={<UploadIcon sx={{ fontSize: 15 }} />}
                  onClick={() => inputRef.current?.click()}
                  sx={{ py: 0.5, px: 1.25, fontSize: 12, bgcolor: "rgba(0,0,0,.55)", color: "#fff", "&:hover": { bgcolor: "rgba(0,0,0,.7)" } }}
                >
                  Replace
                </Button>
                <Button
                  size="small"
                  startIcon={<DeleteIcon sx={{ fontSize: 15 }} />}
                  onClick={removeImage}
                  sx={{ py: 0.5, px: 1.25, fontSize: 12, bgcolor: "rgba(0,0,0,.55)", color: "#fff", "&:hover": { bgcolor: accents.error } }}
                >
                  Remove
                </Button>
              </Box>
            </Box>
          ) : (
            <Box
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={onDrop}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                gap: 0.75,
                py: 4,
                px: 2,
                borderRadius: 1.5,
                border: "1.5px dashed",
                borderColor: dragActive ? "secondary.main" : "maison.line.l16",
                bgcolor: dragActive ? "maison.surface2" : "maison.surfaceImg",
                cursor: "pointer",
                transition: "border-color .15s, background-color .15s",
                "&:hover": { borderColor: "secondary.main" },
              }}
            >
              <Box sx={{ width: 42, height: 42, borderRadius: "50%", bgcolor: `${accents.gold}24`, display: "flex", alignItems: "center", justifyContent: "center", mb: 0.5 }}>
                <ImageIcon sx={{ fontSize: 22, color: "secondary.main" }} />
              </Box>
              <Typography sx={{ fontSize: 14, fontWeight: 500, color: "text.secondary" }}>
                <Box component="span" sx={{ color: "secondary.main", fontWeight: 600 }}>Click to upload</Box> or drag &amp; drop
              </Typography>
              <Typography sx={{ fontSize: 12, color: "text.disabled" }}>JPG, PNG or WebP</Typography>
            </Box>
          )}
        </Field>

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
        <Field label="Stock">
          <TextField fullWidth size="small" type="number" placeholder="0" value={form.stock} onChange={(e) => set("stock", e.target.value)} />
        </Field>
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
