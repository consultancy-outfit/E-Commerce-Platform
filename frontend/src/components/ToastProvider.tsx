"use client";

import * as React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ErrorIcon from "@mui/icons-material/ErrorOutlineOutlined";
import WarningIcon from "@mui/icons-material/WarningAmberOutlined";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { AnimatePresence, motion } from "framer-motion";
import { accents } from "@/src/lib/theme/tokens";

export type ToastSeverity = "success" | "error" | "warning" | "info";

export interface ToastOptions {
  title: string;
  text?: string;
  severity?: ToastSeverity;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

interface ToastItem extends Required<Pick<ToastOptions, "title">> {
  id: number;
  text?: string;
  severity: ToastSeverity;
  actionLabel?: string;
  onAction?: () => void;
}

const SEVERITY = {
  success: { color: accents.success, Icon: CheckCircleIcon },
  error: { color: accents.error, Icon: ErrorIcon },
  warning: { color: accents.warning, Icon: WarningIcon },
  info: { color: accents.info, Icon: InfoIcon },
} as const;

const ToastContext = React.createContext<(o: ToastOptions) => void>(() => {});
export const useToast = () => React.useContext(ToastContext);

/**
 * Top-right stacked toast notifications. Four severities with consistent icons
 * and colours, smooth enter/exit animations, auto-dismiss + manual close.
 * Replaces native alert()/feedback throughout the app.
 */
export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);
  const idRef = React.useRef(0);
  const timers = React.useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = React.useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = React.useCallback(
    (o: ToastOptions) => {
      const id = ++idRef.current;
      const item: ToastItem = {
        id,
        title: o.title,
        text: o.text,
        severity: o.severity ?? "success",
        actionLabel: o.actionLabel,
        onAction: o.onAction,
      };
      setToasts((list) => [...list, item]);
      const timer = setTimeout(() => dismiss(id), o.duration ?? 4200);
      timers.current.set(id, timer);
    },
    [dismiss],
  );

  React.useEffect(() => {
    const map = timers.current;
    return () => map.forEach((t) => clearTimeout(t));
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <Box
        sx={{
          position: "fixed",
          top: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
          left: { xs: 16, sm: "auto" },
          zIndex: 1500,
          display: "flex",
          flexDirection: "column",
          gap: 1.25,
          pointerEvents: "none",
        }}
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => {
            const { color, Icon } = SEVERITY[t.severity];
            return (
              <Box
                key={t.id}
                component={motion.div}
                layout
                initial={{ opacity: 0, x: 28, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 28, scale: 0.98 }}
                transition={{ duration: 0.26, ease: "easeOut" }}
                role="status"
                aria-live="polite"
                sx={{
                  pointerEvents: "auto",
                  width: { xs: "100%", sm: 360 },
                  maxWidth: "100%",
                  display: "flex",
                  gap: 1.25,
                  alignItems: "flex-start",
                  bgcolor: "maison.surfaceImg",
                  border: `1px solid ${color}59`,
                  borderLeft: `3px solid ${color}`,
                  borderRadius: 2,
                  p: "13px 14px",
                  boxShadow: "0 10px 30px rgba(0,0,0,.5)",
                }}
              >
                <Box sx={{ width: 30, height: 30, borderRadius: "50%", bgcolor: `${color}24`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon sx={{ fontSize: 18, color }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0, pt: 0.25 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: 13.5 }}>{t.title}</Typography>
                  {t.text && (
                    <Typography sx={{ fontSize: 12.5, color: "text.secondary", mt: 0.25 }}>{t.text}</Typography>
                  )}
                  {t.actionLabel && (
                    <Typography
                      onClick={() => {
                        t.onAction?.();
                        dismiss(t.id);
                      }}
                      sx={{ fontSize: 12.5, fontWeight: 600, color: "secondary.main", cursor: "pointer", mt: 0.75, display: "inline-block" }}
                    >
                      {t.actionLabel}
                    </Typography>
                  )}
                </Box>
                <IconButton onClick={() => dismiss(t.id)} aria-label="Dismiss" sx={{ p: 0.25, color: "text.disabled", flexShrink: 0 }}>
                  <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            );
          })}
        </AnimatePresence>
      </Box>
    </ToastContext.Provider>
  );
}
