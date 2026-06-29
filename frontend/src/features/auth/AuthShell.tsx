"use client";

import { Box } from "@mui/material";
import ThemeToggle from "@/src/components/ThemeToggle";

/** Centered auth-screen frame with the prototype's crimson radial glow. */
export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 5,
        background:
          "radial-gradient(100% 60% at 50% 0%, rgba(200,32,63,.16), rgba(200,32,63,0) 55%)",
      }}
    >
      <Box sx={{ position: "fixed", top: 22, right: 26, zIndex: 30 }}>
        <ThemeToggle size={22} />
      </Box>
      {children}
    </Box>
  );
}
