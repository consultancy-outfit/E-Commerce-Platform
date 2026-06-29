"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Badge, Box, IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlineOutlined";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLongOutlined";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBagOutlined";
import LogoutIcon from "@mui/icons-material/LogoutOutlined";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { useAppDispatch, useAppSelector } from "@/src/lib/hooks";
import { useGetCartQuery } from "@/src/features/cart/cartApi";
import { logout } from "@/src/features/auth/authSlice";

const NAV: Array<{ label: string; category?: string }> = [
  { label: "New In" },
  { label: "Dresses", category: "Dresses" },
  { label: "Outerwear", category: "Outerwear" },
  { label: "Knitwear", category: "Knitwear" },
];

export default function StorefrontHeader() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const params = useSearchParams();
  const token = useAppSelector((s) => s.auth.token);
  const activeCat = params.get("category");

  // Profile dropdown (only for signed-in users; guests go straight to login).
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchor);

  const onProfileClick = (e: React.MouseEvent<HTMLElement>) => {
    if (token) setMenuAnchor(e.currentTarget);
    else router.push("/login");
  };
  const closeMenu = () => setMenuAnchor(null);
  const signOut = () => {
    closeMenu();
    dispatch(logout());
    router.push("/login");
  };

  // Only fetch the cart (and its count) when signed in.
  const { data: cart } = useGetCartQuery(undefined, { skip: !token });
  const count = cart?.count ?? 0;

  const navTo = (category?: string) =>
    router.push(category ? `/catalog?category=${category}` : "/catalog");

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        height: 70,
        px: 5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: "maison.headerBg",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid",
        borderColor: "maison.line.l08",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 4.5 }}>
        <Logo onClick={() => router.push("/catalog")} />
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
          {NAV.map((n) => {
            const active = pathname === "/catalog" && (n.category ? activeCat === n.category : !activeCat);
            return (
              <Box
                key={n.label}
                onClick={() => navTo(n.category)}
                sx={{
                  cursor: "pointer",
                  fontWeight: 500,
                  fontSize: 14,
                  color: active ? "secondary.main" : "text.secondary",
                  "&:hover": { color: "text.primary" },
                }}
              >
                {n.label}
              </Box>
            );
          })}
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <ThemeToggle />
        <IconButton
          onClick={onProfileClick}
          sx={{ color: "text.secondary" }}
          aria-label="Account"
          aria-haspopup={token ? "menu" : undefined}
          aria-expanded={menuOpen ? "true" : undefined}
        >
          <PersonOutlineIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <Menu
          anchorEl={menuAnchor}
          open={menuOpen}
          onClose={closeMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{
            paper: {
              sx: {
                mt: 1,
                minWidth: 180,
                border: "1px solid",
                borderColor: "maison.line.l12",
                borderRadius: 1.5,
              },
            },
          }}
        >
          <MenuItem onClick={signOut} sx={{ fontSize: 14, py: 1.1, color: "secondary.main" }}>
            <ListItemIcon sx={{ color: "secondary.main", minWidth: 32 }}>
              <LogoutIcon sx={{ fontSize: 18 }} />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
        <IconButton onClick={() => router.push("/orders")} sx={{ color: "text.secondary" }} aria-label="Orders">
          <ReceiptLongIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <IconButton onClick={() => router.push("/cart")} sx={{ color: "text.secondary" }} aria-label="Cart">
          <Badge
            badgeContent={count}
            color="primary"
            sx={{ "& .MuiBadge-badge": { fontSize: 10, fontWeight: 600 } }}
          >
            <ShoppingBagIcon sx={{ fontSize: 20 }} />
          </Badge>
        </IconButton>
      </Box>
    </Box>
  );
}
