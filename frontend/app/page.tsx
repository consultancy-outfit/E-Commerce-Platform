import { redirect } from "next/navigation";

// The storefront home is the catalog.
export default function Home() {
  redirect("/catalog");
}
