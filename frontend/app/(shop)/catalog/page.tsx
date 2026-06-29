"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Box,
  CircularProgress,
  InputBase,
  MenuItem,
  Pagination,
  Select,
  Slider,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { motion } from "framer-motion";
import ProductCard from "@/src/components/ProductCard";
import { useGetProductsQuery, type ProductQuery } from "@/src/features/products/productsApi";
import { CATEGORIES } from "@/src/lib/types";
import { price as fmtPrice } from "@/src/lib/format";

const PRICE_MIN = 0;
const PRICE_MAX = 500;
const PER_PAGE = 8;

const SORTS: Array<{ value: NonNullable<ProductQuery["sort"]>; label: string }> = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

function CatalogInner() {
  const params = useSearchParams();
  const urlCategory = params.get("category");

  const [category, setCategory] = React.useState<string>(urlCategory ?? "All");
  const [search, setSearch] = React.useState("");
  const [debounced, setDebounced] = React.useState("");
  const [range, setRange] = React.useState<number[]>([PRICE_MIN, PRICE_MAX]);
  const [sort, setSort] = React.useState<ProductQuery["sort"]>("newest");
  const [page, setPage] = React.useState(1);

  // Sync category from the header nav links.
  React.useEffect(() => {
    setCategory(urlCategory ?? "All");
    setPage(1);
  }, [urlCategory]);

  // Debounce the search box.
  React.useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const query: ProductQuery = {
    search: debounced || undefined,
    category: category === "All" ? undefined : category,
    minPrice: range[0] > PRICE_MIN ? range[0] : undefined,
    maxPrice: range[1] < PRICE_MAX ? range[1] : undefined,
    sort,
    page,
    limit: PER_PAGE,
  };

  const { data, isFetching } = useGetProductsQuery(query);

  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          height: 240,
          px: 7,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          borderBottom: "1px solid",
          borderColor: "maison.line.l08",
          background: (t) =>
            `radial-gradient(120% 140% at 78% 20%, rgba(200,32,63,.28), rgba(200,32,63,0) 55%), linear-gradient(120deg, ${t.palette.maison.heroA}, ${t.palette.maison.heroB})`,
        }}
      >
        <Typography sx={{ fontWeight: 500, fontSize: 11, letterSpacing: ".3em", textTransform: "uppercase", color: "secondary.main", mb: 1.5 }}>
          Autumn / Winter &apos;26
        </Typography>
        <Typography variant="h1" sx={{ fontSize: 50, mb: 1.5 }}>
          The New Arrivals
        </Typography>
        <Typography sx={{ color: "text.secondary", maxWidth: 440 }}>
          Considered tailoring and fluid silhouettes, made to last beyond the season.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 4.5, px: 5, pt: 4.25, pb: 7.5, maxWidth: 1440, mx: "auto" }}>
        {/* Sidebar */}
        <Box sx={{ width: 220, flexShrink: 0, display: { xs: "none", md: "block" } }}>
          <Typography sx={{ fontWeight: 600, fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "text.disabled", mb: 1.75 }}>
            Category
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.4, mb: 3.75 }}>
            {["All", ...CATEGORIES].map((c) => (
              <Box
                key={c}
                onClick={() => {
                  setCategory(c);
                  setPage(1);
                }}
                sx={{
                  cursor: "pointer",
                  fontWeight: 500,
                  fontSize: 14,
                  color: category === c ? "secondary.main" : "text.secondary",
                  "&:hover": { color: "text.primary" },
                }}
              >
                {c === "All" ? "New In" : c}
              </Box>
            ))}
          </Box>
          <Typography sx={{ fontWeight: 600, fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "text.disabled", mb: 1 }}>
            Price
          </Typography>
          <Slider
            value={range}
            onChange={(_e, v) => setRange(v as number[])}
            onChangeCommitted={() => setPage(1)}
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={5}
            sx={{ color: "primary.main", mx: 0.5, width: "calc(100% - 8px)" }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", fontWeight: 500, fontSize: 13, color: "text.secondary" }}>
            <span>{fmtPrice(range[0])}</span>
            <span>{fmtPrice(range[1])}</span>
          </Box>
        </Box>

        {/* Main */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.75, gap: 2, flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography sx={{ color: "text.disabled", whiteSpace: "nowrap" }}>
                {data ? `${data.total} products` : "…"}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  bgcolor: "maison.surface2",
                  border: "1px solid",
                  borderColor: "maison.line.l12",
                  borderRadius: 1,
                  px: 1.5,
                  py: 1,
                  width: 230,
                }}
              >
                <SearchIcon sx={{ fontSize: 15, color: "text.disabled" }} />
                <InputBase
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products"
                  sx={{ flex: 1, fontSize: 13 }}
                />
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              <Typography sx={{ color: "text.disabled", fontSize: 13 }}>Sort</Typography>
              <Select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as ProductQuery["sort"]);
                  setPage(1);
                }}
                size="small"
                sx={{ bgcolor: "maison.surface2", fontSize: 13, "& .MuiOutlinedInput-notchedOutline": { borderColor: "maison.line.l12" } }}
              >
                {SORTS.map((s) => (
                  <MenuItem key={s.value} value={s.value} sx={{ fontSize: 13 }}>
                    {s.label}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>

          {isFetching && !data ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
              <CircularProgress sx={{ color: "secondary.main" }} />
            </Box>
          ) : data && data.items.length > 0 ? (
            <Box
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4,1fr)" }, gap: 3 }}
            >
              {data.items.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </Box>
          ) : (
            <Typography sx={{ color: "text.disabled", py: 8, textAlign: "center" }}>
              No products match your filters.
            </Typography>
          )}

          {data && data.pageCount > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4.5 }}>
              <Pagination
                count={data.pageCount}
                page={page}
                onChange={(_e, p) => setPage(p)}
                sx={{ "& .Mui-selected": { bgcolor: "primary.main !important", color: "#fff" } }}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={null}>
      <CatalogInner />
    </Suspense>
  );
}
