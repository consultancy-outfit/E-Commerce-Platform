import { baseApi } from "@/src/lib/api/baseApi";
import type { PaginatedProducts, Product } from "@/src/lib/types";

export interface ProductQuery {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price-asc" | "price-desc";
  page?: number;
  limit?: number;
}

export const productsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<PaginatedProducts, ProductQuery>({
      query: (params) => ({ url: "/products", params: clean(params) }),
      providesTags: (res) =>
        res
          ? [...res.items.map((p) => ({ type: "Product" as const, id: p._id })), { type: "Product", id: "LIST" }]
          : [{ type: "Product", id: "LIST" }],
    }),
    getProduct: build.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Product", id }],
    }),
    getRecommendations: build.query<Product[], string>({
      query: (id) => `/products/${id}/recommendations`,
    }),
  }),
});

/** Drop empty/undefined params so the URL stays clean. */
function clean(params: ProductQuery): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "" && v !== null) out[k] = v as string | number;
  }
  return out;
}

export const { useGetProductsQuery, useGetProductQuery, useGetRecommendationsQuery } = productsApi;
