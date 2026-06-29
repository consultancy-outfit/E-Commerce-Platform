"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, Button, TextField, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import PageHero from "@/src/components/PageHero";
import { accents } from "@/src/lib/theme/tokens";

const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().required("Email is required").email("Enter a valid email"),
  subject: yup.string().required("Subject is required"),
  message: yup.string().required("Message is required").min(10, "Please add a little more detail"),
});
type Values = yup.InferType<typeof schema>;

export default function ContactPage() {
  const [sent, setSent] = React.useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Values>({ resolver: yupResolver(schema) });

  // No backend contact endpoint by design; this is the client-side confirmation.
  const onSubmit = () => setSent(true);

  return (
    <Box>
      <PageHero
        eyebrow="We're here to help"
        title="Contact us"
        subtitle="Our client advisors are available Monday to Saturday and reply within one business day."
      />
      <Box sx={{ maxWidth: 1000, mx: "auto", px: 5, py: 6, display: "flex", gap: 5, flexWrap: "wrap" }}>
        <Box sx={{ flex: 1, minWidth: 320 }}>
          {!sent ? (
            <>
              <Typography variant="h4" sx={{ fontSize: 24, mb: 0.75 }}>Send us a message</Typography>
              <Typography sx={{ color: "text.disabled", mb: 3 }}>Fill in the form below and we&apos;ll be in touch shortly.</Typography>
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.75, mb: 1.75 }}>
                  <TextField fullWidth size="small" placeholder="Full name" {...register("name")} error={!!errors.name} helperText={errors.name?.message} />
                  <TextField fullWidth size="small" placeholder="you@example.com" {...register("email")} error={!!errors.email} helperText={errors.email?.message} />
                </Box>
                <TextField fullWidth size="small" placeholder="Subject" {...register("subject")} error={!!errors.subject} helperText={errors.subject?.message} sx={{ mb: 1.75 }} />
                <TextField fullWidth multiline minRows={5} placeholder="How can we help?" {...register("message")} error={!!errors.message} helperText={errors.message?.message} sx={{ mb: 2.25 }} />
                <Button type="submit">Send message</Button>
              </form>
            </>
          ) : (
            <Box sx={{ bgcolor: "background.paper", border: `1px solid ${accents.success}4d`, borderRadius: 2, p: 5, textAlign: "center" }}>
              <Box sx={{ width: 60, height: 60, borderRadius: "50%", bgcolor: `${accents.success}1f`, border: `1px solid ${accents.success}66`, display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2.5 }}>
                <CheckIcon sx={{ color: accents.success }} />
              </Box>
              <Typography variant="h4" sx={{ fontSize: 24, mb: 1 }}>Message sent</Typography>
              <Typography sx={{ fontSize: 14, color: "text.disabled", maxWidth: 320, mx: "auto", mb: 2.75 }}>
                Thank you for reaching out. A client advisor will reply to your email within one business day.
              </Typography>
              <Button variant="outlined" onClick={() => { reset(); setSent(false); }}>Send another</Button>
            </Box>
          )}
        </Box>
        <Box sx={{ width: 320, flexShrink: 0 }}>
          <Box sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "maison.line.l10", borderRadius: 2, p: 3.25 }}>
            <Typography variant="h5" sx={{ fontSize: 18, mb: 2.5 }}>Client services</Typography>
            <Info label="Email" value="clients@maison.com" />
            <Info label="Phone" value="+44 20 7946 0100" />
            <Info label="Hours" value="Mon–Sat · 9am–7pm GMT" />
            <Info label="Atelier" value="14 Rue des Archives, 75004 Paris" last />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Info({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <Box sx={{ mb: last ? 0 : 2.5 }}>
      <Typography sx={{ fontWeight: 500, fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "text.disabled", mb: 0.4 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: 14 }}>{value}</Typography>
    </Box>
  );
}
