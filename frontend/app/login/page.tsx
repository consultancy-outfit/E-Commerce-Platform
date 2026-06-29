"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Typography, TextField } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AuthShell from "@/src/features/auth/AuthShell";
import PortalToggle, { type Portal } from "@/src/features/auth/PortalToggle";
import { useToast } from "@/src/components/ToastProvider";
import { loginSchema, type LoginValues } from "@/src/schemas/auth";
import { useLoginMutation } from "@/src/features/auth/authApi";
import { useAppDispatch } from "@/src/lib/hooks";
import { setCredentials } from "@/src/features/auth/authSlice";

// Seeded demo credentials, prefilled to make review easy (see README).
const DEMO: Record<Portal, LoginValues> = {
  customer: { email: "elise.moreau@gmail.com", password: "Customer123!" },
  admin: { email: "admin@maison.com", password: "Admin123!" },
};

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [portal, setPortal] = React.useState<Portal>("customer");
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: yupResolver(loginSchema), defaultValues: DEMO.customer });

  const switchPortal = (p: Portal) => {
    setPortal(p);
    setServerError(null);
    reset(DEMO[p]);
  };

  const onSubmit = async (values: LoginValues) => {
    setServerError(null);
    try {
      const res = await login(values).unwrap();
      dispatch(setCredentials({ token: res.accessToken, user: res.user }));
      toast({ title: `Welcome back, ${res.user.firstName}`, severity: "success" });
      // Customers land on the home/landing page; admins on their dashboard.
      router.push(res.user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      const e = err as { data?: { message?: string | string[] } };
      const msg = e.data?.message;
      const text = Array.isArray(msg) ? msg[0] : msg || "Unable to sign in";
      setServerError(text);
      toast({ title: "Sign in failed", text, severity: "error" });
    }
  };

  return (
    <AuthShell
      brandTitle="Welcome back."
      brandSubtitle="Sign in to continue — your bag, orders and saved pieces are right where you left them."
      points={["Early access to new arrivals", "Free shipping over £150", "30-day free returns"]}
    >
      <PortalToggle value={portal} onChange={switchPortal} />

      <Typography variant="h4" sx={{ fontSize: 30, mb: 0.5 }}>
        {portal === "admin" ? "Admin sign in" : "Sign in"}
      </Typography>
      <Typography sx={{ color: "text.disabled", mb: 3.5 }}>
        {portal === "admin" ? "Access the Maison console" : "Welcome back — sign in to continue shopping"}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Typography sx={{ fontWeight: 500, fontSize: 12, color: "text.secondary", mb: 0.8 }}>Email</Typography>
        <TextField
          fullWidth
          size="small"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.8 }}>
          <Typography sx={{ fontWeight: 500, fontSize: 12, color: "text.secondary" }}>Password</Typography>
         
        </Box>
        <TextField
          fullWidth
          size="small"
          type="password"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
          sx={{ mb: 2 }}
        />

        {serverError && <Typography sx={{ color: "error.main", fontSize: 13, mb: 2 }}>{serverError}</Typography>}

        <Button type="submit" fullWidth disabled={isLoading} sx={{ mb: 2.2, py: 1.6 }}>
          {isLoading ? "Signing in…" : portal === "admin" ? "Sign in to console" : "Sign in"}
        </Button>
      </form>

      {portal === "customer" ? (
        <>
          <Typography sx={{ textAlign: "center", color: "text.disabled" }}>
            New here?{" "}
            <Link href="/signup" style={{ color: "#C9A24B", fontWeight: 600 }}>
              Create an account
            </Link>
          </Typography>
          <Typography sx={{ textAlign: "center", fontSize: 13, color: "text.disabled", mt: 1.2 }}>
            or{" "}
            <Link href="/catalog" style={{ textDecoration: "underline" }}>
              browse as guest
            </Link>
          </Typography>
        </>
      ) : (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.9, fontSize: 13, color: "text.disabled" }}>
          <LockOutlinedIcon sx={{ fontSize: 14 }} />
          Authorised personnel only
        </Box>
      )}
    </AuthShell>
  );
}
