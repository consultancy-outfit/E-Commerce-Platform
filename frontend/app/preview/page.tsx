"use client";

import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Logo from "@/src/components/Logo";
import ThemeToggle from "@/src/components/ThemeToggle";
import { statusColors } from "@/src/lib/theme/tokens";

/**
 * Phase 1 design-system preview. Proves the Maison MUI theme (typography,
 * palette, base components) renders correctly — toggle the theme to verify
 * both dark and light modes.
 */
export default function ThemePreview() {
  const theme = useTheme();
  const m = theme.palette.maison;

  const StatusChip = ({ label }: { label: string }) => {
    const c = statusColors[label.toLowerCase()] ?? m.accents.gold;
    return (
      <Chip
        label={label}
        size="small"
        sx={{ color: c, bgcolor: `${c}1f`, border: `1px solid ${c}4d` }}
      />
    );
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Box
        sx={{
          height: 70,
          px: 5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${m.line.l08}`,
          bgcolor: m.headerBg,
        }}
      >
        <Logo />
        <ThemeToggle />
      </Box>

      <Container sx={{ py: 6 }}>
        <Typography variant="h2" sx={{ fontSize: 50, mb: 1 }}>
          The New Arrivals
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 5 }}>
          Marcellus headings, Hanken Grotesk body. Crimson primary, gold accents.
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 4, flexWrap: "wrap", gap: 2 }}>
          <Button variant="contained">Add to cart</Button>
          <Button variant="outlined">Continue shopping</Button>
          <Button variant="text" sx={{ color: "secondary.main" }}>
            Forgot?
          </Button>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mb: 4, flexWrap: "wrap", gap: 1 }}>
          {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((s) => (
            <StatusChip key={s} label={s} />
          ))}
        </Stack>

        <Stack direction="row" spacing={3} sx={{ flexWrap: "wrap", gap: 3 }}>
          <TextField label="Email" placeholder="you@example.com" sx={{ width: 320 }} />
          <Card sx={{ p: 3, width: 320 }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              Order summary
            </Typography>
            <Stack direction="row" sx={{ justifyContent: "space-between" }}>
              <Typography sx={{ color: "text.secondary" }}>Total</Typography>
              <Typography variant="h5">£189.00</Typography>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
