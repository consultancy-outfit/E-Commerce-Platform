"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Badge, Box, IconButton, Menu, MenuItem } from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBagOutlined";
import LogoutIcon from "@mui/icons-material/LogoutOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { useAppDispatch, useAppSelector } from "@/src/lib/hooks";
import { useGetCartQuery } from "@/src/features/cart/cartApi";
import { logout } from "@/src/features/auth/authSlice";

const NAV: Array<{ label: string; href: string }> = [
  { label: "Home", href: "/" },
  { label: "Catalog", href: "/catalog" },
  { label: "Orders", href: "/orders" },
  { label: "Shipping", href: "/shipping" },
  { label: "Returns", href: "/returns" },
  { label: "Contact", href: "/contact" },
];

export default function StorefrontHeader() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const token = useAppSelector((s) => s.auth.token);

  // Cart count badge — only fetch the cart when signed in.
  const { data: cart } = useGetCartQuery(undefined, { skip: !token });
  const count = cart?.count ?? 0;

  // Profile icon = logout: clicking it signs the user out and returns to login.
  // (Guests have no session, so it simply takes them to the login page.)
  const handleLogout = () => {
    if (token) dispatch(logout());
    router.push("/login");
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    // Catalog stays highlighted while browsing a product.
    if (href === "/catalog") return pathname === "/catalog" || pathname.startsWith("/product");
    return pathname === href;
  };

  // Mobile nav menu (below md, where the inline links are hidden).
  const [navAnchor, setNavAnchor] = React.useState<null | HTMLElement>(null);
  const goTo = (href: string) => {
    setNavAnchor(null);
    router.push(href);
  };

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
      <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 4.5 } }}>
        {/* Hamburger — only below md, where the inline nav is hidden */}
        <IconButton
          onClick={(e) => setNavAnchor(e.currentTarget)}
          aria-label="Open navigation"
          sx={{ display: { xs: "inline-flex", md: "none" }, color: "text.secondary", ml: -1 }}
        >
          <MenuIcon sx={{ fontSize: 22 }} />
        </IconButton>
        <Logo onClick={() => router.push("/")} />
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
          {NAV.map((n) => {
            const active = isActive(n.href);
            return (
              <Box
                key={n.href}
                onClick={() => router.push(n.href)}
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
        <IconButton onClick={() => router.push("/cart")} sx={{ color: "text.secondary" }} aria-label="Cart">
          <Badge
            badgeContent={count}
            color="primary"
            sx={{ "& .MuiBadge-badge": { fontSize: 10, fontWeight: 600 } }}
          >
            <ShoppingBagIcon sx={{ fontSize: 20 }} />
          </Badge>
        </IconButton>
        <IconButton onClick={handleLogout} sx={{ color: "text.secondary" }} aria-label="Log out">
          <LogoutIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      {/* Mobile nav dropdown */}
      <Menu
        anchorEl={navAnchor}
        open={Boolean(navAnchor)}
        onClose={() => setNavAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: { mt: 1, minWidth: 180, border: "1px solid", borderColor: "maison.line.l12", borderRadius: 1.5 },
          },
        }}
      >
        {NAV.map((n) => (
          <MenuItem
            key={n.href}
            onClick={() => goTo(n.href)}
            sx={{ fontSize: 14, fontWeight: 500, py: 1.1, color: isActive(n.href) ? "secondary.main" : "text.secondary" }}
          >
            {n.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
