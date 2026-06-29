"use client";

import * as React from "react";
import { Box, Button, Dialog, Typography } from "@mui/material";
import WarningIcon from "@mui/icons-material/WarningAmberOutlined";
import { accents } from "@/src/lib/theme/tokens";

interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

const ConfirmContext = React.createContext<(o: ConfirmOptions) => Promise<boolean>>(
  () => Promise.resolve(false),
);

/** `const confirm = useConfirm(); if (await confirm({...})) { ... }` */
export const useConfirm = () => React.useContext(ConfirmContext);

/**
 * App-wide custom confirmation modal that replaces window.confirm. Styled with
 * the existing design system; returns a promise resolving to the user's choice.
 */
export default function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<ConfirmOptions | null>(null);
  const resolver = React.useRef<((v: boolean) => void) | null>(null);

  const confirm = React.useCallback((o: ConfirmOptions) => {
    setState(o);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const close = (result: boolean) => {
    resolver.current?.(result);
    resolver.current = null;
    setState(null);
  };

  const destructive = state?.destructive;
  const accent = destructive ? accents.error : accents.crimson;

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Dialog
        open={!!state}
        onClose={() => close(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 2.5, p: 0.5 } } }}
      >
        {state && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", gap: 1.75, alignItems: "flex-start", mb: 2.5 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: `${accent}1f`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <WarningIcon sx={{ fontSize: 20, color: accent }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ fontSize: 19, mb: state.message ? 0.75 : 0 }}>
                  {state.title}
                </Typography>
                {state.message && (
                  <Typography sx={{ fontSize: 14, lineHeight: 1.6, color: "text.secondary" }}>
                    {state.message}
                  </Typography>
                )}
              </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.25 }}>
              <Button variant="outlined" onClick={() => close(false)} sx={{ color: "text.primary" }}>
                {state.cancelLabel ?? "Cancel"}
              </Button>
              <Button
                onClick={() => close(true)}
                sx={{
                  bgcolor: accent,
                  "&:hover": { bgcolor: accent, filter: "brightness(0.92)" },
                }}
              >
                {state.confirmLabel ?? "Confirm"}
              </Button>
            </Box>
          </Box>
        )}
      </Dialog>
    </ConfirmContext.Provider>
  );
}
