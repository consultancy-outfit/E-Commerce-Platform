"use client";

import * as React from "react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { useServerInsertedHTML } from "next/navigation";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createMaisonTheme } from "./theme";
import type { ThemeMode } from "./tokens";

interface ColorModeContextValue {
  mode: ThemeMode;
  toggle: () => void;
}

const ColorModeContext = React.createContext<ColorModeContextValue>({
  mode: "dark",
  toggle: () => {},
});

export const useColorMode = () => React.useContext(ColorModeContext);

const STORAGE_KEY = "maison-theme";

/**
 * Emotion cache registry (the documented MUI App Router pattern) plus the Maison
 * color-mode provider. Defaults to dark; persists the user's choice to
 * localStorage and syncs `data-theme` on <html> to avoid a flash.
 */
export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [{ cache, flush }] = React.useState(() => {
    const c = createCache({ key: "mui", prepend: true });
    c.compat = true;
    const prevInsert = c.insert;
    let inserted: string[] = [];
    c.insert = (...args) => {
      const serialized = args[1];
      if (c.inserted[serialized.name] === undefined) inserted.push(serialized.name);
      return prevInsert(...args);
    };
    const flush = () => {
      const prev = inserted;
      inserted = [];
      return prev;
    };
    return { cache: c, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) return null;
    let styles = "";
    for (const name of names) styles += cache.inserted[name];
    return (
      <style
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  const [mode, setMode] = React.useState<ThemeMode>("dark");

  // Read persisted preference on mount (client only).
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") setMode(saved);
    } catch {
      /* ignore */
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  const colorMode = React.useMemo<ColorModeContextValue>(
    () => ({ mode, toggle: () => setMode((m) => (m === "dark" ? "light" : "dark")) }),
    [mode],
  );

  const theme = React.useMemo(() => createMaisonTheme(mode), [mode]);

  return (
    <CacheProvider value={cache}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ColorModeContext.Provider>
    </CacheProvider>
  );
}
