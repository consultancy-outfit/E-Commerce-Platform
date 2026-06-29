# Skill: frontend-conventions

Reusable conventions for the Maison Next.js frontend.

## MUI theming from tokens
- `src/lib/theme/tokens.ts` holds the dark + light token objects extracted from
  the prototype. `createMaisonTheme(mode)` builds the MUI theme: palette,
  typography (`Marcellus` for h1–h4/display & prices, `Hanken Grotesk` for body),
  shape (radius 4–8), components overrides (Button, TextField, Card, Chip).
- `ThemeRegistry` is a client provider holding the mode, toggling it, and
  persisting to `localStorage` (`maison-theme`), defaulting to dark. Wrap the app.
- Never hardcode a hex that exists as a token — use `theme.palette.*` / tokens.

## RTK Query slices
- One `baseApi` (`src/lib/api/baseApi.ts`) with `fetchBaseQuery` whose
  `prepareHeaders` attaches `Authorization: Bearer <token>` from the auth slice.
- Each domain injects endpoints via `baseApi.injectEndpoints` and exports hooks
  (`useGetProductsQuery`, `useCheckoutMutation`, ...). Use `providesTags`/
  `invalidatesTags` for cache coherence (e.g. cart, orders, products).

## Forms (RHF + Yup)
- `useForm({ resolver: yupResolver(schema) })`. Schemas live in `src/schemas/`.
- Surface field errors inline; map server 400 validation errors to a toast or
  field errors.

## Motion & carousels
- Framer Motion for route/section transitions (fade/slide), modal enter/exit, and
  add-to-cart toast. Keep durations short (~0.2–0.35s) to match the prototype.
- Swiper for the "Recommended for you" / featured carousels.

## Design-fidelity checklist (per screen)
- [ ] Matches the prototype layout, spacing, and component shapes
- [ ] Marcellus headings / Hanken Grotesk body; correct accent colours
- [ ] Works in both dark and light themes
- [ ] Loading + empty + error states handled
- [ ] Validation errors visible; disabled/processing button states
- [ ] Responsive (page body never scrolls horizontally)
