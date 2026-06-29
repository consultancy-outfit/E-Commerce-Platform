"use client";

import { Box, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import Logo from "@/src/components/Logo";
import ThemeToggle from "@/src/components/ThemeToggle";
import { accents } from "@/src/lib/theme/tokens";

/**
 * Split-screen auth frame: a decorative Maison brand panel (left, desktop) and
 * the form (right / full-width on mobile). Theme-aware surfaces with subtle
 * crimson + gold abstract shapes — no colours borrowed from outside the palette.
 */
export default function AuthShell({
  brandTitle,
  brandSubtitle,
  points,
  children,
}: {
  brandTitle: string;
  brandSubtitle: string;
  points?: string[];
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, md: 5 },
        bgcolor: "background.default",
        background:
          "radial-gradient(100% 55% at 50% 0%, rgba(200,32,63,.12), rgba(200,32,63,0) 55%)",
      }}
    >
      <Box sx={{ position: "fixed", top: 22, right: 26, zIndex: 30 }}>
        <ThemeToggle size={22} />
      </Box>

      <Box
        sx={{
          width: 1000,
          maxWidth: "100%",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.05fr 1fr" },
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "maison.line.l10",
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,.35)",
        }}
      >
        {/* ===== Brand panel (desktop only) ===== */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            position: "relative",
            overflow: "hidden",
            flexDirection: "column",
            justifyContent: "space-between",
            p: 5,
            minHeight: 580,
            background: (t) =>
              `linear-gradient(155deg, ${t.palette.maison.heroA}, ${t.palette.maison.bgDeep})`,
            borderRight: "1px solid",
            borderColor: "maison.line.l08",
          }}
        >
          {/* abstract shapes */}
          <Box sx={{ position: "absolute", top: -90, right: -70, width: 280, height: 280, borderRadius: "50%", background: `radial-gradient(circle, ${accents.crimson}55, transparent 70%)` }} />
          <Box sx={{ position: "absolute", bottom: -70, left: -50, width: 240, height: 240, borderRadius: "50%", background: `radial-gradient(circle, ${accents.gold}40, transparent 70%)` }} />
          <Box sx={{ position: "absolute", top: 120, left: -40, width: 120, height: 120, borderRadius: "50%", border: `1px solid ${accents.gold}40` }} />
          <Box
            component="svg"
            viewBox="0 0 200 60"
            sx={{ position: "absolute", top: 40, right: 36, width: 150, height: 45, opacity: 0.5 }}
          >
            <path d="M2 40 C 30 8, 60 8, 88 32 S 150 56, 198 14" fill="none" stroke={accents.gold} strokeWidth="1.5" strokeLinecap="round" />
          </Box>
          <Box sx={{ position: "absolute", bottom: 120, right: 50, display: "flex", gap: 1 }}>
            {[0, 1, 2].map((i) => (
              <Box key={i} sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: accents.crimson, opacity: 0.5 }} />
            ))}
          </Box>

          {/* content */}
          <Box sx={{ position: "relative" }}>
            <Logo size={36} letterSpacing=".34em" />
          </Box>
          <Box sx={{ position: "relative" }}>
            <Typography variant="h2" sx={{ fontSize: 40, lineHeight: 1.08, mb: 1.75 }}>
              {brandTitle}
            </Typography>
            <Typography sx={{ fontSize: 15, color: "text.secondary", maxWidth: 360, mb: points?.length ? 3.5 : 0 }}>
              {brandSubtitle}
            </Typography>
            {points && points.length > 0 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {points.map((p) => (
                  <Box key={p} sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                    <Box sx={{ width: 22, height: 22, borderRadius: "50%", bgcolor: `${accents.gold}24`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <CheckIcon sx={{ fontSize: 13, color: accents.gold }} />
                    </Box>
                    <Typography sx={{ fontSize: 13.5, color: "text.secondary" }}>{p}</Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
          <Typography sx={{ position: "relative", fontWeight: 600, fontSize: 11, letterSpacing: ".26em", color: "text.disabled" }}>
            MAISON © 2026
          </Typography>
        </Box>

        {/* ===== Form panel ===== */}
        <Box sx={{ p: { xs: 3.5, sm: 5, md: 6 }, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {/* logo shown here on mobile (brand panel is hidden) */}
          <Box sx={{ display: { xs: "flex", md: "none" }, justifyContent: "center", mb: 4 }}>
            <Logo size={36} letterSpacing=".34em" />
          </Box>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
