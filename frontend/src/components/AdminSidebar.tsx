"use client";

import { usePathname, useRouter } from "next/navigation";
import { Box, Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/GridViewOutlined";
import InventoryIcon from "@mui/icons-material/Inventory2Outlined";
import OrdersIcon from "@mui/icons-material/ReceiptLongOutlined";
import LogoutIcon from "@mui/icons-material/LogoutOutlined";
import { accents } from "@/src/lib/theme/tokens";
import { useAppDispatch } from "@/src/lib/hooks";
import { logout } from "@/src/features/auth/authSlice";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: DashboardIcon },
  { label: "Products", href: "/admin/products", icon: InventoryIcon },
  { label: "Orders", href: "/admin/orders", icon: OrdersIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const signOut = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <Box
      sx={{
        width: 240,
        flexShrink: 0,
        bgcolor: "maison.bgDeep",
        borderRight: "1px solid",
        borderColor: "maison.line.l08",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh",
      }}
    >
      <Box sx={{ p: 2.75, borderBottom: "1px solid", borderColor: "maison.line.l08", display: "flex", alignItems: "center", gap: 1.25 }}>
        <Box sx={{ width: 30, height: 30, border: `1px solid ${accents.gold}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: accents.gold, fontFamily: "var(--font-marcellus)", fontSize: 15 }}>
          M
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: 11, letterSpacing: ".26em" }}>MAISON</Typography>
          <Typography sx={{ fontWeight: 500, fontSize: 9, letterSpacing: ".2em", color: accents.gold }}>ADMIN</Typography>
        </Box>
      </Box>

      <Box sx={{ p: "16px 14px", display: "flex", flexDirection: "column", gap: 0.4 }}>
        {NAV.map((n) => {
          const active = pathname === n.href;
          const Icon = n.icon;
          return (
            <Box
              key={n.href}
              onClick={() => router.push(n.href)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 1.6,
                py: 1.4,
                borderRadius: 1.5,
                cursor: "pointer",
                fontWeight: 500,
                fontSize: 14,
                color: active ? "#E0394F" : "text.secondary",
                bgcolor: active ? "rgba(200,32,63,.12)" : "transparent",
                "&:hover": { color: active ? "#E0394F" : "text.primary" },
              }}
            >
              <Icon sx={{ fontSize: 17 }} />
              {n.label}
            </Box>
          );
        })}
      </Box>

      <Box
        onClick={signOut}
        sx={{ mt: "auto", p: 2.25, borderTop: "1px solid", borderColor: "maison.line.l08", display: "flex", alignItems: "center", gap: 1, fontWeight: 500, fontSize: 13, color: "secondary.main", cursor: "pointer" }}
      >
        <LogoutIcon sx={{ fontSize: 15 }} />
        Log out
      </Box>
    </Box>
  );
}
