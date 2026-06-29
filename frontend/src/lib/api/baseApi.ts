import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/**
 * Single RTK Query API. Domain endpoints are injected via injectEndpoints in
 * feature folders. The JWT (from the auth slice) is attached to every request.
 */
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Product", "Cart", "Order", "AdminOrder", "Analytics"],
  endpoints: () => ({}),
});

/** Absolute URL for an image path returned by the API (/uploads/..) or external URL. */
export function imageUrl(path: string): string {
  if (!path) return "";
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  return `${API_URL}${path}`;
}
