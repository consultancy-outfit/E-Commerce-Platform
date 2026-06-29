import { createTheme, type Theme } from "@mui/material/styles";
import { accents, getTokens, type MaisonTokens, type ThemeMode } from "./tokens";

/**
 * Augment MUI's types so the full Maison token set is available on
 * `theme.palette.maison` for components that need raw surfaces/lines.
 */
declare module "@mui/material/styles" {
  interface Palette {
    maison: MaisonTokens & { accents: typeof accents };
  }
  interface PaletteOptions {
    maison?: MaisonTokens & { accents: typeof accents };
  }
}

// Font family CSS variables are provided by next/font in the root layout.
const SERIF = "var(--font-marcellus), 'Marcellus', Georgia, serif";
const SANS =
  "var(--font-hanken), 'Hanken Grotesk', -apple-system, system-ui, sans-serif";

export function createMaisonTheme(mode: ThemeMode): Theme {
  const t = getTokens(mode);

  return createTheme({
    palette: {
      mode,
      primary: { main: accents.crimson, dark: accents.crimsonHover, contrastText: "#fff" },
      secondary: { main: accents.gold },
      success: { main: accents.success },
      warning: { main: accents.warning },
      info: { main: accents.info },
      error: { main: accents.error },
      background: { default: t.bg, paper: t.surface },
      text: { primary: t.text, secondary: t.text2, disabled: t.textFaint },
      divider: t.line.l10,
      maison: { ...t, accents },
    },
    shape: { borderRadius: 4 },
    typography: {
      fontFamily: SANS,
      // Default every Typography to the theme-correct text colour so plain text
      // (no explicit colour) can't inherit a stale colour across a theme switch.
      // Muted text still overrides via sx/color; nothing uses color="inherit".
      allVariants: { color: t.text },
      // Marcellus is the display/serif face used for headings, prices, titles.
      // Headings carry an explicit theme-correct colour so they never depend on
      // the inherited body colour (which can lag a theme switch and wash out on
      // the light surface).
      h1: { fontFamily: SERIF, fontWeight: 400, lineHeight: 1.05, color: t.text },
      h2: { fontFamily: SERIF, fontWeight: 400, lineHeight: 1.05, color: t.text },
      h3: { fontFamily: SERIF, fontWeight: 400, color: t.text },
      h4: { fontFamily: SERIF, fontWeight: 400, color: t.text },
      h5: { fontFamily: SERIF, fontWeight: 400, color: t.text },
      h6: { fontFamily: SERIF, fontWeight: 400, color: t.text },
      button: { textTransform: "none", fontWeight: 600 },
      body1: { fontSize: 14 },
      body2: { fontSize: 13 },
    },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true, variant: "contained" },
        styleOverrides: {
          // contained primary uses palette.primary (crimson) + primary.dark hover automatically.
          root: { borderRadius: 4, fontWeight: 600, paddingTop: 12, paddingBottom: 12 },
          outlined: { borderColor: t.line.l18, color: t.text2 },
          text: { color: t.text2 },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: t.surface2,
            borderRadius: 4,
            "& fieldset": { borderColor: t.line.l16 },
            "&:hover fieldset": { borderColor: t.line.l30 },
            "&.Mui-focused fieldset": { borderColor: accents.gold },
          },
          input: { fontSize: 14 },
        },
      },
      MuiInputLabel: { styleOverrides: { root: { fontSize: 13, color: t.text2 } } },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: "none" },
          outlined: { borderColor: t.line.l10, borderRadius: 8 },
        },
      },
      MuiCard: {
        defaultProps: { variant: "outlined" },
        styleOverrides: { root: { backgroundColor: t.surface, borderColor: t.line.l10, borderRadius: 8 } },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 999, fontWeight: 600, fontSize: 10, letterSpacing: ".06em", textTransform: "uppercase" },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          "::-webkit-scrollbar": { width: 10, height: 10 },
          "::-webkit-scrollbar-thumb": { background: t.track, borderRadius: 6 },
          "::-webkit-scrollbar-track": { background: "transparent" },
          body: { backgroundColor: t.bg, color: t.text },
        },
      },
    },
  });
}
