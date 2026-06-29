import { baseApi } from "@/src/lib/api/baseApi";
import type { Order, ShippingAddress } from "@/src/lib/types";

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    checkout: build.mutation<Order, { shippingAddress: ShippingAddress; paymentMethodId?: string }>({
      query: (body) => ({ url: "/orders/checkout", method: "POST", body }),
      invalidatesTags: ["Cart", "Order", "AdminOrder", "Analytics", "Product"],
    }),
    getMyOrders: build.query<Order[], void>({
      query: () => "/orders",
      providesTags: ["Order"],
    }),
    getMyOrder: build.query<Order, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Order", id }],
    }),
  }),
});

export const { useCheckoutMutation, useGetMyOrdersQuery, useGetMyOrderQuery } = ordersApi;
