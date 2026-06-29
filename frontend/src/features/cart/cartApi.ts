import { baseApi } from "@/src/lib/api/baseApi";
import type { Cart } from "@/src/lib/types";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCart: build.query<Cart, void>({
      query: () => "/cart",
      providesTags: ["Cart"],
    }),
    addCartItem: build.mutation<Cart, { productId: string; size: string; quantity: number }>({
      query: (body) => ({ url: "/cart/items", method: "POST", body }),
      invalidatesTags: ["Cart"],
    }),
    updateCartItem: build.mutation<Cart, { productId: string; size: string; quantity: number }>({
      query: (body) => ({ url: "/cart/items", method: "PATCH", body }),
      invalidatesTags: ["Cart"],
    }),
    removeCartItem: build.mutation<Cart, { productId: string; size: string }>({
      query: (body) => ({ url: "/cart/items", method: "DELETE", body }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
} = cartApi;
