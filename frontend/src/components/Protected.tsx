"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { useAppSelector } from "@/src/lib/hooks";
import type { Role } from "@/src/lib/types";

/**
 * Client-side route guard. Redirects unauthenticated users to /login and
 * wrong-role users away from the area. (The backend independently enforces
 * authorization on every request; this is the UX layer.)
 */
export default function Protected({
  role,
  children,
}: {
  role?: Role;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { token, user } = useAppSelector((s) => s.auth);
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }
    if (role && user?.role !== role) {
      router.replace(user?.role === "admin" ? "/admin" : "/catalog");
      return;
    }
    setChecked(true);
  }, [token, user, role, router]);

  if (!checked) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress sx={{ color: "secondary.main" }} />
      </Box>
    );
  }
  return <>{children}</>;
}
