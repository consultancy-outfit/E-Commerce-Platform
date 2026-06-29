"use client";

import { Box, Typography } from "@mui/material";
import ThemeToggle from "./ThemeToggle";

/** Admin page header: title on the left, theme toggle (and optional action) on the right. */
export default function AdminTopbar({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <Box
      sx={{
        height: 64,
        px: 4,
        borderBottom: "1px solid",
        borderColor: "maison.line.l08",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="h4" sx={{ fontSize: 22 }}>
        {title}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2.25 }}>
        <ThemeToggle />
        {action}
      </Box>
    </Box>
  );
}
