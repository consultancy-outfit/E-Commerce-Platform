"use client";

import { Suspense } from "react";
import { Box } from "@mui/material";
import StorefrontHeader from "@/src/components/StorefrontHeader";
import StorefrontFooter from "@/src/components/StorefrontFooter";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
      <Suspense fallback={null}>
        <StorefrontHeader />
      </Suspense>
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
      <StorefrontFooter />
    </Box>
  );
}
