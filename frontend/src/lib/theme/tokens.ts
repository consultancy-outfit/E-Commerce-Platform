/**
 * Maison design tokens — extracted verbatim from the prototype's CSS variables
 * (`:root` = dark, `[data-theme="light"]` = light) in docs/Maison-Prototype.html.
 * These are the single source of truth for colour; the MUI theme is built from them.
 */

export type ThemeMode = "dark" | "light";

/** Accent colours are shared across both themes. */
export const accents = {
  crimson: "#C8203F", // primary actions
  crimsonHover: "#E0394F",
  gold: "#C9A24B", // accents, links
  success: "#4FA77E",
  warning: "#D9A441",
  info: "#5B8BC9",
  error: "#D9534F",
} as const;

export interface MaisonTokens {
  bg: string;
  bgDeep: string;
  surface: string;
  surface2: string;
  surfaceImg: string;
  track: string;
  heroA: string;
  heroB: string;
  headerBg: string;
  text: string;
  text2: string;
  textMuted: string;
  textFaint: string;
  /** Hairline borders at increasing opacity. */
  line: {
    l06: string;
    l08: string;
    l10: string;
    l12: string;
    l14: string;
    l16: string;
    l18: string;
    l30: string;
  };
}

const dark: MaisonTokens = {
  bg: "#0C0C0E",
  bgDeep: "#0a0a0c",
  surface: "#121215",
  surface2: "#1A1A1E",
  surfaceImg: "#16141a",
  track: "#26262C",
  heroA: "#1a1418",
  heroB: "#0f0e12",
  headerBg: "rgba(12,12,14,.92)",
  text: "#F4F0E9",
  text2: "#CFCAC1",
  textMuted: "#8B867D",
  textFaint: "#6B6B72",
  line: {
    l06: "rgba(244,240,233,.06)",
    l08: "rgba(244,240,233,.08)",
    l10: "rgba(244,240,233,.1)",
    l12: "rgba(244,240,233,.12)",
    l14: "rgba(244,240,233,.14)",
    l16: "rgba(244,240,233,.16)",
    l18: "rgba(244,240,233,.18)",
    l30: "rgba(244,240,233,.3)",
  },
};

// Light theme: a soft warm-beige / light-brown palette — warmer and less
// glaring than stark white, with espresso text for strong contrast.
const light: MaisonTokens = {
  bg: "#F0E9DA", // warm beige page background
  bgDeep: "#E7DCC8", // deeper beige for sidebar / sunken sections / table headers
  surface: "#FBF6EC", // warm ivory cards / paper / modals / dropdowns
  surface2: "#EFE7D6", // input fills / secondary surfaces (sits below surface)
  surfaceImg: "#E5DAC4", // image placeholders / toast & toggle surface
  track: "#D6C9AE", // scrollbar & slider track
  heroA: "#EFE3CE", // hero / brand-panel gradient (warm)
  heroB: "#E6D8BE",
  headerBg: "rgba(240,233,218,.9)", // translucent sticky header (matches bg)
  text: "#241C12", // espresso — high contrast on beige
  text2: "#4F4536",
  textMuted: "#847459",
  textFaint: "#A99A80",
  // Hairline borders in warm brown.
  line: {
    l06: "rgba(74,54,24,.08)",
    l08: "rgba(74,54,24,.11)",
    l10: "rgba(74,54,24,.14)",
    l12: "rgba(74,54,24,.16)",
    l14: "rgba(74,54,24,.18)",
    l16: "rgba(74,54,24,.22)",
    l18: "rgba(74,54,24,.26)",
    l30: "rgba(74,54,24,.34)",
  },
};

export const tokensByMode: Record<ThemeMode, MaisonTokens> = { dark, light };

export function getTokens(mode: ThemeMode): MaisonTokens {
  return tokensByMode[mode];
}

/** Status → badge colour map, used for product stock and order status pills. */
export const statusColors: Record<string, string> = {
  pending: accents.warning,
  processing: accents.info,
  shipped: accents.gold,
  delivered: accents.success,
  cancelled: accents.error,
  // product stock states
  active: accents.success,
  "in stock": accents.success,
  "low stock": accents.warning,
  "sold out": accents.error,
};
