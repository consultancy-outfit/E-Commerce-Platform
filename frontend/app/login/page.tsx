"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Typography, TextField } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Logo from "@/src/components/Logo";
import AuthShell from "@/src/features/auth/AuthShell";
import { loginSchema, type LoginValues } from "@/src/schemas/auth";
import { useLoginMutation } from "@/src/features/auth/authApi";
import { useAppDispatch } from "@/src/lib/hooks";
import { setCredentials } from "@/src/features/auth/authSlice";

type Portal = "customer" | "admin";

// Seeded demo credentials, prefilled to make review easy (see README).
const DEMO: Record<Portal, LoginValues> = {
  customer: { email: "elise.moreau@gmail.com", password: "Customer123!" },
  admin: { email: "admin@maison.com", password: "Admin123!" },
};

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
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
      router.push(res.user.role === "admin" ? "/admin" : "/catalog");
    } catch (err) {
      const e = err as { data?: { message?: string | string[] } };
      const msg = e.data?.message;
      setServerError(Array.isArray(msg) ? msg[0] : msg || "Unable to sign in");
    }
  };

  const tabStyle = (active: boolean) => ({
    flex: 1,
    textAlign: "center" as const,
    py: 1.1,
    borderRadius: 1,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 13,
    color: active ? "#fff" : "text.disabled",
    bgcolor: active ? "primary.main" : "transparent",
  });

  return (
    <AuthShell>
      <Box sx={{ width: 420, maxWidth: "100%" }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 5.5 }}>
          <Logo size={36} letterSpacing=".34em" />
        </Box>

        <Box
          sx={{
            display: "flex",
            bgcolor: "maison.surfaceImg",
            border: "1px solid",
            borderColor: "maison.line.l14",
            borderRadius: 1.5,
            p: 0.5,
            mb: 3.5,
          }}
        >
          <Box onClick={() => switchPortal("customer")} sx={tabStyle(portal === "customer")}>
            Customer Portal
          </Box>
          <Box onClick={() => switchPortal("admin")} sx={tabStyle(portal === "admin")}>
            Admin Portal
          </Box>
        </Box>

        <Typography variant="h4" sx={{ fontSize: 34, textAlign: "center", mb: 0.5 }}>
          {portal === "admin" ? "Admin sign in" : "Welcome back"}
        </Typography>
        <Typography sx={{ color: "text.disabled", textAlign: "center", mb: 4 }}>
          {portal === "admin" ? "Access the Maison console" : "Sign in to continue shopping"}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Typography sx={{ fontWeight: 500, fontSize: 12, color: "text.secondary", mb: 0.8 }}>
            Email
          </Typography>
          <TextField
            fullWidth
            size="small"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.8 }}>
            <Typography sx={{ fontWeight: 500, fontSize: 12, color: "text.secondary" }}>
              Password
            </Typography>
            <Typography sx={{ fontWeight: 500, fontSize: 12, color: "secondary.main", cursor: "pointer" }}>
              Forgot?
            </Typography>
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

          {serverError && (
            <Typography sx={{ color: "error.main", fontSize: 13, mb: 2 }}>{serverError}</Typography>
          )}

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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.9,
              fontSize: 13,
              color: "text.disabled",
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 14 }} />
            Authorised personnel only
          </Box>
        )}
      </Box>
    </AuthShell>
  );
}
