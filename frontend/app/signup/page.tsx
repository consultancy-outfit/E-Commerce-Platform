"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Typography, TextField } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AuthShell from "@/src/features/auth/AuthShell";
import PortalToggle, { type Portal } from "@/src/features/auth/PortalToggle";
import { signupSchema, type SignupValues } from "@/src/schemas/auth";
import { useSignupMutation } from "@/src/features/auth/authApi";
import { useAppDispatch } from "@/src/lib/hooks";
import { setCredentials } from "@/src/features/auth/authSlice";

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [portal, setPortal] = React.useState<Portal>("customer");
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [signup, { isLoading }] = useSignupMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: yupResolver(signupSchema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "", agree: false },
  });

  const onSubmit = async (values: SignupValues) => {
    setServerError(null);
    try {
      const res = await signup({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      }).unwrap();
      dispatch(setCredentials({ token: res.accessToken, user: res.user }));
      router.push("/");
    } catch (err) {
      const e = err as { data?: { message?: string | string[] } };
      const msg = e.data?.message;
      setServerError(Array.isArray(msg) ? msg[0] : msg || "Unable to create account");
    }
  };

  const label = (t: string) => (
    <Typography sx={{ fontWeight: 500, fontSize: 12, color: "text.secondary", mb: 0.8 }}>{t}</Typography>
  );

  return (
    <AuthShell
      brandTitle="Join Maison."
      brandSubtitle="Create an account for early access to new arrivals, private sales and atelier stories."
      points={["Early access to new arrivals", "Members-only private sales", "Faster checkout & order tracking"]}
    >
      <PortalToggle value={portal} onChange={setPortal} />

      {portal === "admin" ? (
        // Admin accounts are provisioned internally — no public registration.
        <Box>
          <Typography variant="h4" sx={{ fontSize: 30, mb: 0.5 }}>Admin access</Typography>
          <Typography sx={{ color: "text.disabled", mb: 3.5 }}>
            Console accounts are provisioned internally.
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              alignItems: "flex-start",
              bgcolor: "maison.surfaceImg",
              border: "1px solid",
              borderColor: "maison.line.l12",
              borderRadius: 1.5,
              p: 2.25,
              mb: 3,
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 18, color: "secondary.main", mt: 0.25 }} />
            <Typography sx={{ fontSize: 13.5, lineHeight: 1.6, color: "text.secondary" }}>
              Admin accounts can&apos;t be self-registered. Ask your administrator to create one,
              then sign in to the Maison console.
            </Typography>
          </Box>
          <Button fullWidth onClick={() => router.push("/login")} sx={{ mb: 2.2, py: 1.6 }}>
            Go to admin sign in
          </Button>
          <Typography sx={{ textAlign: "center", color: "text.disabled" }}>
            Shopping instead?{" "}
            <Box component="span" onClick={() => setPortal("customer")} sx={{ color: "secondary.main", fontWeight: 600, cursor: "pointer" }}>
              Create a customer account
            </Box>
          </Typography>
        </Box>
      ) : (
        <>
          <Typography variant="h4" sx={{ fontSize: 30, mb: 0.5 }}>Create your account</Typography>
          <Typography sx={{ color: "text.disabled", mb: 3.5 }}>
            Join Maison for early access to new arrivals &amp; private sales
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.75, mb: 2 }}>
              <Box>
                {label("First name")}
                <TextField fullWidth size="small" placeholder="Elise" {...register("firstName")}
                  error={!!errors.firstName} helperText={errors.firstName?.message} />
              </Box>
              <Box>
                {label("Last name")}
                <TextField fullWidth size="small" placeholder="Moreau" {...register("lastName")}
                  error={!!errors.lastName} helperText={errors.lastName?.message} />
              </Box>
            </Box>
            {label("Email")}
            <TextField fullWidth size="small" placeholder="you@example.com" {...register("email")}
              error={!!errors.email} helperText={errors.email?.message} sx={{ mb: 2 }} />
            {label("Password")}
            <TextField fullWidth size="small" type="password" placeholder="At least 8 characters"
              {...register("password")} error={!!errors.password} helperText={errors.password?.message}
              sx={{ mb: 2 }} />

            <Controller
              name="agree"
              control={control}
              render={({ field }) => (
                <Box>
                  <Box
                    onClick={() => field.onChange(!field.value)}
                    sx={{ display: "flex", alignItems: "flex-start", gap: 1.25, mb: errors.agree ? 0.5 : 3, cursor: "pointer" }}
                  >
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: 0.75,
                        flexShrink: 0,
                        border: "1px solid",
                        borderColor: field.value ? "secondary.main" : "maison.line.l18",
                        bgcolor: field.value ? "secondary.main" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {field.value && <CheckIcon sx={{ fontSize: 14, color: "#0C0C0E" }} />}
                    </Box>
                    <Typography sx={{ fontSize: 13, lineHeight: 1.5, color: "text.disabled" }}>
                      I agree to Maison&apos;s{" "}
                      <Box component="span" sx={{ color: "secondary.main" }}>Terms of Service</Box> and{" "}
                      <Box component="span" sx={{ color: "secondary.main" }}>Privacy Policy</Box>.
                    </Typography>
                  </Box>
                  {errors.agree && (
                    <Typography sx={{ color: "error.main", fontSize: 12, mb: 2 }}>
                      {errors.agree.message}
                    </Typography>
                  )}
                </Box>
              )}
            />

            {serverError && (
              <Typography sx={{ color: "error.main", fontSize: 13, mb: 2 }}>{serverError}</Typography>
            )}

            <Button type="submit" fullWidth disabled={isLoading} sx={{ mb: 2.2, py: 1.6 }}>
              {isLoading ? "Creating…" : "Create account"}
            </Button>
          </form>

          <Typography sx={{ textAlign: "center", color: "text.disabled" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#C9A24B", fontWeight: 600 }}>
              Sign in
            </Link>
          </Typography>
        </>
      )}
    </AuthShell>
  );
}
