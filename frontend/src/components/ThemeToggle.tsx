"use client";

import { IconButton } from "@mui/material";
import { LightMode, DarkModeOutlined } from "@mui/icons-material";
import { useColorMode } from "@/src/lib/theme/ThemeRegistry";

/** Sun/moon theme switch, matching the prototype's header toggle. */
export default function ThemeToggle({ size = 20 }: { size?: number }) {
  const { mode, toggle } = useColorMode();
  return (
    <IconButton
      onClick={toggle}
      aria-label="Toggle colour theme"
      title="Toggle theme"
      sx={{ color: "text.secondary", p: 0.5 }}
    >
      {mode === "dark" ? (
        <LightMode sx={{ fontSize: size }} />
      ) : (
        <DarkModeOutlined sx={{ fontSize: size }} />
      )}
    </IconButton>
  );
}
