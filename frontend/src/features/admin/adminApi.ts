import { baseApi } from "@/src/lib/api/baseApi";
import type { Analytics, Order, OrderStatus, Product } from "@/src/lib/types";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAnalytics: build.query<Analytics, void>({
      query: () => "/admin/analytics",
      providesTags: ["Analytics"],
    }),
    getAdminOrders: build.query<Order[], void>({
      query: () => "/admin/orders",
      providesTags: ["AdminOrder"],
    }),
    updateOrderStatus: build.mutation<Order, { id: string; status: OrderStatus }>({
      query: ({ id, status }) => ({ url: `/admin/orders/${id}/status`, method: "PATCH", body: { status } }),
      invalidatesTags: ["AdminOrder", "Order", "Analytics"],
    }),
    // Product CRUD — FormData so an optional image file can be uploaded.
    createProduct: build.mutation<Product, FormData>({
      query: (body) => ({ url: "/products", method: "POST", body }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    updateProduct: build.mutation<Product, { id: string; body: FormData }>({
      query: ({ id, body }) => ({ url: `/products/${id}`, method: "PATCH", body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Product", id }, { type: "Product", id: "LIST" }],
    }),
    deleteProduct: build.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/products/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAnalyticsQuery,
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = adminApi;
