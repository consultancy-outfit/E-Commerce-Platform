"use client";

import { Box } from "@mui/material";
import Protected from "@/src/components/Protected";
import AdminSidebar from "@/src/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Protected role="admin">
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
        <AdminSidebar />
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>{children}</Box>
      </Box>
    </Protected>
  );
}
