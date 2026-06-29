"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Box, Button, CircularProgress, InputBase, Typography } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShippingOutlined";
import AutorenewIcon from "@mui/icons-material/AutorenewOutlined";
import CraftIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import LeafIcon from "@mui/icons-material/EnergySavingsLeafOutlined";
import StarIcon from "@mui/icons-material/StarRounded";
import QuoteIcon from "@mui/icons-material/FormatQuoteRounded";
import ArrowIcon from "@mui/icons-material/ArrowForward";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import { motion } from "framer-motion";
import ProductCard from "@/src/components/ProductCard";
import { useToast } from "@/src/components/ToastProvider";
import { accents } from "@/src/lib/theme/tokens";
import { useGetProductsQuery } from "@/src/features/products/productsApi";

// Editorial imagery (Unsplash, consistent with the seeded product photos).
const ph = (id: string, w = 900, h = 1100) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&crop=entropy&q=80&auto=format`;

const PROMOS = [
  { label: "Dresses", caption: "Fluid silhouettes", id: "1539008835657-9e8e9680c956" },
  { label: "Outerwear", caption: "Considered tailoring", id: "1539109136881-3be0616acf4b" },
  { label: "Knitwear", caption: "Grade-A cashmere", id: "1434389677669-e08b4cac3105" },
];

const WHY = [
  { icon: CraftIcon, color: accents.gold, title: "Considered craftsmanship", body: "Made in small runs from natural fibres, finished by hand in our Paris atelier." },
  { icon: LocalShippingIcon, color: accents.success, title: "Complimentary shipping", body: "Free tracked delivery on every UK order over £150, dispatched within 24 hours.", href: "/shipping" },
  { icon: AutorenewIcon, color: accents.info, title: "30-day free returns", body: "Changed your mind? Return or exchange within 30 days — shipping is on us.", href: "/returns" },
  { icon: LeafIcon, color: "#7BA05B", title: "Carbon-neutral", body: "Every parcel is offset through our certified climate partner. Quietly responsible." },
];

const TESTIMONIALS = [
  { quote: "The cut and the cloth are exceptional — it has become the piece I reach for every week.", name: "Camille D.", place: "Paris" },
  { quote: "Beautifully made and it arrived next day, wrapped in tissue. This is how luxury should feel.", name: "Helena R.", place: "London" },
  { quote: "Understated, considered, and built to last. Maison has quietly replaced half my wardrobe.", name: "Sofia M.", place: "Milan" },
];

const SOCIALS = [
  { icon: InstagramIcon, href: "https://instagram.com", label: "Instagram" },
  { icon: FacebookIcon, href: "https://facebook.com", label: "Facebook" },
  { icon: TwitterIcon, href: "https://twitter.com", label: "Twitter" },
];

const SECTION_PX = { xs: 3, md: 7 };

export default function LandingPage() {
  const router = useRouter();
  const toast = useToast();
  const { data: featured, isLoading } = useGetProductsQuery({ limit: 4, sort: "newest" });
  const [email, setEmail] = React.useState("");

  const subscribe = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ title: "Enter a valid email", text: "Please check your address and try again." });
      return;
    }
    setEmail("");
    toast({ title: "You're on the list", text: "Welcome to Maison — watch your inbox for early access." });
  };

  return (
    <Box>
      {/* ===== HERO ===== */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.05fr 1fr" },
          alignItems: "stretch",
          borderBottom: "1px solid",
          borderColor: "maison.line.l08",
        }}
      >
        <Box
          sx={{
            px: SECTION_PX,
            py: { xs: 7, md: 11 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            background: (t) =>
              `radial-gradient(120% 130% at 20% 20%, rgba(200,32,63,.26), rgba(200,32,63,0) 55%), linear-gradient(120deg, ${t.palette.maison.heroA}, ${t.palette.maison.heroB})`,
        }}
        >
          <Box component={motion.div} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Typography sx={{ fontWeight: 500, fontSize: 11, letterSpacing: ".3em", textTransform: "uppercase", color: "secondary.main", mb: 2 }}>
              Autumn / Winter &apos;26
            </Typography>
            <Typography variant="h1" sx={{ fontSize: { xs: 40, md: 60 }, lineHeight: 1.04, mb: 2.5 }}>
              Quiet luxury,
              <br />
              made to last.
            </Typography>
            <Typography sx={{ fontSize: { xs: 15, md: 16 }, color: "text.secondary", maxWidth: 460, mb: 4 }}>
              Considered tailoring and fluid silhouettes in natural fibres — designed in Paris,
              finished by hand, and made to move with you beyond the season.
            </Typography>
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
              <Button onClick={() => router.push("/catalog")} endIcon={<ArrowIcon sx={{ fontSize: 16 }} />} sx={{ px: 3, py: 1.6 }}>
                Shop the collection
              </Button>
              <Button variant="outlined" onClick={() => router.push("/catalog?category=Dresses")} sx={{ px: 3, py: 1.6 }}>
                Explore new in
              </Button>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            minHeight: { xs: 320, md: "auto" },
            backgroundImage: `url(${ph("1483985988355-763728e1935b", 1100, 1300)})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            bgcolor: "maison.surfaceImg",
          }}
        />
      </Box>

      {/* ===== PROMO BANNERS ===== */}
      <Box sx={{ px: SECTION_PX, py: { xs: 6, md: 8 }, maxWidth: 1440, mx: "auto" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 3 }}>
          <Typography variant="h2" sx={{ fontSize: { xs: 28, md: 34 } }}>Shop by category</Typography>
          <Box onClick={() => router.push("/catalog")} sx={{ display: { xs: "none", sm: "block" }, fontSize: 14, fontWeight: 500, color: "secondary.main", cursor: "pointer" }}>
            View all →
          </Box>
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3,1fr)" }, gap: 3 }}>
          {PROMOS.map((p) => (
            <Box
              key={p.label}
              component={motion.div}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              onClick={() => router.push(`/catalog?category=${p.label}`)}
              sx={{ position: "relative", aspectRatio: "4 / 5", borderRadius: 2, overflow: "hidden", cursor: "pointer", bgcolor: "maison.surfaceImg" }}
            >
              <Box component="img" src={ph(p.id, 700, 875)} alt={p.label} sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  p: 3,
                  background: "linear-gradient(to top, rgba(12,12,14,.72), rgba(12,12,14,0) 55%)",
                }}
              >
                <Typography sx={{ fontWeight: 500, fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "#C9A24B", mb: 0.5 }}>
                  {p.caption}
                </Typography>
                <Typography variant="h4" sx={{ fontSize: 24, color: "#F4F0E9", display: "flex", alignItems: "center", gap: 1 }}>
                  {p.label} <ArrowIcon sx={{ fontSize: 18 }} />
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ===== FEATURED PRODUCTS (real catalog data) ===== */}
      <Box sx={{ px: SECTION_PX, pb: { xs: 6, md: 9 }, maxWidth: 1440, mx: "auto" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 3 }}>
          <Box>
            <Typography sx={{ fontWeight: 500, fontSize: 11, letterSpacing: ".3em", textTransform: "uppercase", color: "secondary.main", mb: 1 }}>
              Just landed
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: 28, md: 34 } }}>New arrivals</Typography>
          </Box>
          <Button variant="outlined" onClick={() => router.push("/catalog")}>View all</Button>
        </Box>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress sx={{ color: "secondary.main" }} />
          </Box>
        ) : (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4,1fr)" }, gap: 3 }}>
            {featured?.items.map((p) => <ProductCard key={p._id} product={p} />)}
          </Box>
        )}
      </Box>

      {/* ===== WHY CHOOSE US ===== */}
      <Box sx={{ bgcolor: "maison.bgDeep", borderTop: "1px solid", borderBottom: "1px solid", borderColor: "maison.line.l08" }}>
        <Box sx={{ px: SECTION_PX, py: { xs: 6, md: 9 }, maxWidth: 1440, mx: "auto" }}>
          <Typography sx={{ textAlign: "center", fontWeight: 500, fontSize: 11, letterSpacing: ".3em", textTransform: "uppercase", color: "secondary.main", mb: 1 }}>
            The Maison difference
          </Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: 28, md: 34 }, textAlign: "center", mb: 5 }}>
            Why choose us
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4,1fr)" }, gap: 2.5 }}>
            {WHY.map((w) => {
              const Icon = w.icon;
              return (
                <Box
                  key={w.title}
                  onClick={() => w.href && router.push(w.href)}
                  sx={{
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "maison.line.l10",
                    borderRadius: 2,
                    p: 3,
                    cursor: w.href ? "pointer" : "default",
                    transition: "border-color .2s",
                    "&:hover": { borderColor: w.href ? "maison.line.l18" : "maison.line.l10" },
                  }}
                >
                  <Box sx={{ width: 44, height: 44, borderRadius: "50%", bgcolor: `${w.color}1f`, display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                    <Icon sx={{ fontSize: 22, color: w.color }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontSize: 17, mb: 1 }}>{w.title}</Typography>
                  <Typography sx={{ fontSize: 13, lineHeight: 1.65, color: "text.disabled" }}>{w.body}</Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* ===== TESTIMONIALS ===== */}
      <Box sx={{ px: SECTION_PX, py: { xs: 6, md: 9 }, maxWidth: 1440, mx: "auto" }}>
        <Typography variant="h2" sx={{ fontSize: { xs: 28, md: 34 }, textAlign: "center", mb: 5 }}>
          Loved by our clients
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3,1fr)" }, gap: 3 }}>
          {TESTIMONIALS.map((t) => (
            <Box key={t.name} sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "maison.line.l10", borderRadius: 2, p: 3.5 }}>
              <QuoteIcon sx={{ fontSize: 34, color: "secondary.main", opacity: 0.5, mb: 1 }} />
              <Box sx={{ display: "flex", gap: 0.25, mb: 1.5 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} sx={{ fontSize: 16, color: accents.gold }} />
                ))}
              </Box>
              <Typography sx={{ fontSize: 15, lineHeight: 1.7, color: "text.secondary", mb: 2.5 }}>
                &ldquo;{t.quote}&rdquo;
              </Typography>
              <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{t.name}</Typography>
              <Typography sx={{ fontSize: 12, color: "text.disabled" }}>{t.place}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ===== NEWSLETTER ===== */}
      <Box sx={{ bgcolor: "maison.bgDeep", borderTop: "1px solid", borderColor: "maison.line.l08" }}>
        <Box sx={{ px: SECTION_PX, py: { xs: 7, md: 9 }, maxWidth: 720, mx: "auto", textAlign: "center" }}>
          <Typography sx={{ fontWeight: 500, fontSize: 11, letterSpacing: ".3em", textTransform: "uppercase", color: "secondary.main", mb: 1.5 }}>
            Stay in the know
          </Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: 28, md: 34 }, mb: 1.5 }}>
            Join the Maison list
          </Typography>
          <Typography sx={{ color: "text.secondary", mb: 4 }}>
            Early access to new arrivals, private sales, and atelier stories. No noise.
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5, maxWidth: 480, mx: "auto", flexDirection: { xs: "column", sm: "row" } }}>
            <Box sx={{ flex: 1, display: "flex", alignItems: "center", bgcolor: "maison.surface2", border: "1px solid", borderColor: "maison.line.l16", borderRadius: 1, px: 2 }}>
              <InputBase
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && subscribe()}
                placeholder="you@example.com"
                type="email"
                sx={{ flex: 1, fontSize: 14, py: 1.4 }}
              />
            </Box>
            <Button onClick={subscribe} sx={{ px: 3.5, py: 1.6 }}>Subscribe</Button>
          </Box>
        </Box>
      </Box>

      {/* ===== SOCIAL BAND ===== */}
      <Box sx={{ px: SECTION_PX, py: { xs: 5, md: 6 }, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <Typography sx={{ fontWeight: 500, fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "text.disabled" }}>
          Follow Maison
        </Typography>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          {SOCIALS.map((s) => {
            const Icon = s.icon;
            return (
              <Box
                key={s.label}
                component="a"
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  border: "1px solid",
                  borderColor: "maison.line.l14",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "text.secondary",
                  transition: "all .2s",
                  "&:hover": { color: "secondary.main", borderColor: "secondary.main" },
                }}
              >
                <Icon sx={{ fontSize: 18 }} />
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
