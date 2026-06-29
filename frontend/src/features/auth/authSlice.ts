import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/src/lib/types";

interface AuthState {
  token: string | null;
  user: User | null;
}

const STORAGE_KEY = "maison-auth";

function loadInitial(): AuthState {
  if (typeof window === "undefined") return { token: null, user: null };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AuthState;
  } catch {
    /* ignore */
  }
  return { token: null, user: null };
}

const authSlice = createSlice({
  name: "auth",
  initialState: loadInitial(),
  reducers: {
    setCredentials(state, action: PayloadAction<{ token: string; user: User }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        /* ignore */
      }
    },
    logout(state) {
      state.token = null;
      state.user = null;
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
