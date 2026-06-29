"use client";

import { Box } from "@mui/material";

export type Portal = "customer" | "admin";

/** Segmented Customer/Admin control, themed to the Maison palette. Used only on
 *  the Login and Sign Up pages. */
export default function PortalToggle({
  value,
  onChange,
}: {
  value: Portal;
  onChange: (p: Portal) => void;
}) {
  const seg = (active: boolean) => ({
    flex: 1,
    textAlign: "center" as const,
    py: 1.1,
    borderRadius: 1,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 13,
    userSelect: "none" as const,
    transition: "color .2s, background-color .2s",
    color: active ? "#fff" : "text.disabled",
    bgcolor: active ? "primary.main" : "transparent",
    "&:hover": active ? {} : { color: "text.secondary" },
  });

  return (
    <Box
      role="tablist"
      aria-label="Select portal"
      sx={{
        display: "flex",
        bgcolor: "maison.surfaceImg",
        border: "1px solid",
        borderColor: "maison.line.l14",
        borderRadius: 1.5,
        p: 0.5,
        mb: 3.5,
      }}
    >
      <Box role="tab" aria-selected={value === "customer"} onClick={() => onChange("customer")} sx={seg(value === "customer")}>
        Customer Portal
      </Box>
      <Box role="tab" aria-selected={value === "admin"} onClick={() => onChange("admin")} sx={seg(value === "admin")}>
        Admin Portal
      </Box>
    </Box>
  );
}
