/** Shared API types mirroring the backend contract in CLAUDE.md. */

export type Role = "customer" | "admin";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedProducts {
  items: Product[];
  total: number;
  page: number;
  pageCount: number;
}

export interface CartLine {
  product: Product;
  productId: string;
  size: string;
  quantity: number;
  lineTotal: number;
}

export interface Cart {
  id: string;
  items: CartLine[];
  count: number;
  subtotal: number;
  tax: number;
  total: number;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  line1: string;
  city: string;
  postcode: string;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  paymentRef: string;
  createdAt: string;
  updatedAt: string;
}

export interface Analytics {
  totalSales: number;
  orderCount: number;
  ordersByStatus: Record<OrderStatus, number>;
  topProducts: Array<{ productId: string; name: string; units: number }>;
}

export const CATEGORIES = [
  "Dresses",
  "Outerwear",
  "Knitwear",
  "Trousers",
  "Accessories",
] as const;
