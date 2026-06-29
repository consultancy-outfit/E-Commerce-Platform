"use client";

import * as React from "react";
import { Box, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { AnimatePresence, motion } from "framer-motion";
import { accents } from "@/src/lib/theme/tokens";

interface ToastOptions {
  title: string;
  text?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const ToastContext = React.createContext<(o: ToastOptions) => void>(() => {});
export const useToast = () => React.useContext(ToastContext);

/** Bottom-centre toast matching the prototype (surface card, green check). */
export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = React.useState<ToastOptions | null>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = React.useCallback((o: ToastOptions) => {
    setToast(o);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <AnimatePresence>
        {toast && (
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.28 }}
            sx={{
              position: "fixed",
              bottom: 28,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1400,
              display: "flex",
              gap: 1.4,
              alignItems: "center",
              bgcolor: "maison.surfaceImg",
              border: `1px solid ${accents.success}4d`,
              borderRadius: 2,
              p: "14px 18px",
              boxShadow: "0 10px 30px rgba(0,0,0,.5)",
            }}
          >
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                bgcolor: `${accents.success}24`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <CheckIcon sx={{ fontSize: 16, color: accents.success }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: 13 }}>{toast.title}</Typography>
              {toast.text && (
                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>{toast.text}</Typography>
              )}
            </Box>
            {toast.actionLabel && (
              <Typography
                onClick={() => {
                  toast.onAction?.();
                  setToast(null);
                }}
                sx={{ fontSize: 12, fontWeight: 500, color: "secondary.main", cursor: "pointer", ml: 1 }}
              >
                {toast.actionLabel}
              </Typography>
            )}
          </Box>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}
