# Claude Code — Kickoff Prompt: Maison Mini E‑Commerce Platform

> Paste everything below into Claude Code. **Before sending, attach both files**: `Fullstack_Assessment_Task_Final_3.md` (the requirements) and `Maison_Prototype__standalone___5_.html` (the design). They are your two sources of truth — the `.md` defines *what to build*, the HTML defines *how it must look*.

---

You are the lead engineer driving the build of a full‑stack mini e‑commerce platform ("Maison") through an agentic, multi‑subagent workflow. Work in disciplined, verifiable increments. **Do not dump everything in one go** — follow the phased plan, and **commit to git after each completed module** with a clear, conventional message (e.g. `feat(auth): JWT login + role guards`). Never end with a single "final commit".

## 0. Sources of truth & non‑negotiables

- The attached **`Fullstack_Assessment_Task_Final_3.md`** is the authoritative requirements spec. Re‑read it before each phase. Everything you build must satisfy it, including the cross‑cutting requirements (validation on client *and* server, error handling, data integrity, security, seed script, README, tests) and the **open‑ended "relevant product suggestions" requirement**.
- The attached **`Maison_Prototype__standalone___5_.html`** is the design. The final UI must visually match it: same layout, structure, typography, colours, spacing, dark **and** light themes, and the same screens. **Do not invent a different look and do not drop in an off‑the‑shelf template.** Extract the design language from this file (see Phase 1).
- Anything genuinely ambiguous: make a reasonable decision and record it in `NOTES.md`. Do not let an agent silently guess.

## Locked tech stack

**Backend**
- NestJS (modular architecture)
- MongoDB via Mongoose, using a **Repository pattern** (controllers → services → repositories; no DB access in controllers)
- JWT authentication, with **two roles: `admin` and `customer`**, enforced via guards
- Swagger UI for API docs (`/api/docs`)
- Stripe **test mode** for payments
- Local **filesystem** storage for product images (saved to a `/uploads` dir, served statically) — do not use a cloud bucket

**Frontend**
- Next.js (App Router) + TypeScript
- MUI for components/layout, themed to match the Maison design (custom MUI theme with the design tokens)
- RTK Query for all data fetching/caching
- React Hook Form + **Yup** for all forms and validation
- Framer Motion for animations/transitions
- Swiper for any carousels/sliders (e.g. featured products, recommendations)
- Stripe (test mode) on the checkout

If a library choice is unclear, prefer the stack above and note the reasoning in `NOTES.md`.

---

## Phase 0 — Project context & agent setup (do this FIRST, before any feature code)

1. Initialise the git repo and a sensible monorepo layout, e.g.:
   ```
   /backend        (NestJS)
   /frontend       (Next.js)
   /docs           (copies of the spec + design for reference)
   CLAUDE.md
   .claude/
   ```
   Copy the two attached files into `/docs` so they're tracked and referenceable.

2. **Create `CLAUDE.md`** at the repo root. It is the persistent project brief every agent reads. It must contain:
   - One‑paragraph project summary and the locked tech stack above.
   - Architecture conventions: backend repository pattern + folder structure; frontend feature‑folder + RTK Query slice structure; shared API contract location.
   - The data model (collections/schemas) and the full **REST endpoint contract** (method, path, auth/role, request, response) — fill this in once designed in Phase 2 and keep it updated as the single source of truth shared between frontend and backend.
   - Coding standards: validation everywhere, meaningful HTTP status codes, no stack traces leaked to clients, no secrets in the repo (use `.env` + `.env.example`), passwords hashed (bcrypt/argon2), never plain text.
   - The commit policy (commit per module, conventional messages) and the design‑fidelity rule.

3. **Create the `.claude/` folder** with **subagents** (`.claude/agents/*.md`, each with frontmatter `name`, `description`, and tools) and **skills** (`.claude/skills/*` reusable instruction docs). Define at minimum:

   **Subagents**
   - **`backend-engineer`** — owns the NestJS app: modules, schemas, repositories, services, controllers, DTOs, guards, Swagger, Stripe (test), local image upload. Always validates input with class‑validator DTOs and enforces role guards.
   - **`frontend-engineer`** — owns the Next.js app: pages/components matching the Maison design, MUI theme, RTK Query slices, RHF + Yup forms, Framer Motion, Swiper. Pulls colours/typography/spacing from the design tokens.
   - **`design-system-agent`** — reads `Maison_Prototype__standalone___5_.html`, extracts the design tokens (CSS variables for dark + light themes, the Marcellus/Hanken Grotesk fonts, the crimson `#C8203F` and gold `#C9A24B` accents, surfaces, borders, radii), and produces a reusable MUI theme + base components (buttons, inputs, cards, headers, toasts) that the frontend‑engineer builds on. Guarantees visual fidelity to the prototype.
   - **`integration-agent`** — the bridge between frontend and backend. Verifies that every RTK Query endpoint matches the real backend contract in `CLAUDE.md` (paths, payloads, auth headers, status codes), wires the two apps together, runs end‑to‑end flows (signup → browse → cart → checkout → order → admin status update), and fixes any contract mismatch on either side. Updates `CLAUDE.md`'s contract section when anything changes.
   - **`supervisor-verifier`** *(compulsory gatekeeper)* — reviews every module before it's considered done and committed. Checks output against the spec, runs the build/lint/tests, verifies auth + authorization (customer cannot reach admin routes; users only see their own cart/orders), validation on both client and server, and data integrity (stock can't go negative, totals are server‑computed not trusted from the client, status transitions are valid). It must explicitly sign off — if it finds a problem, the responsible agent fixes it before committing.

   **Skills** (reusable instruction docs, kept separate for FE and BE)
   - `backend-conventions` — repository pattern, DTO validation, error filter, JWT/role guard usage, Stripe test flow, local upload handling.
   - `frontend-conventions` — MUI theming from tokens, RTK Query slice patterns, RHF+Yup form pattern, Framer Motion/Swiper usage, design‑fidelity checklist.
   - `verification-checklist` — the per‑module checklist `supervisor-verifier` runs (build passes, tests pass, auth enforced, validation both sides, integrity holds, matches design, no secrets, no leaked stack traces).

4. **Commit** Phase 0: `chore: project scaffold, CLAUDE.md, agents and skills`.

> After Phase 0, dispatch work to the relevant subagent for each phase, and route every module through `supervisor-verifier` before committing.

---

## Phase 1 — Design system extraction (`design-system-agent`)
Read the Maison HTML. Produce the MUI theme (dark + light, theme toggle), global fonts, and base components matching the prototype. Build a tiny preview page proving the theme renders correctly in both themes.
**Commit:** `feat(design): MUI theme + base components from Maison prototype`.

## Phase 2 — Backend foundation + auth (`backend-engineer`)
NestJS scaffold, Mongo connection, config/env, global validation pipe + exception filter. Implement signup/login with JWT, password hashing, `customer`/`admin` roles, and role guards. Define the data model and the full endpoint contract in `CLAUDE.md`. Swagger live at `/api/docs`.
**Verify** (supervisor): bad input rejected with proper status codes; passwords hashed; admin‑only guard blocks customers.
**Commit:** `feat(backend): auth, JWT, roles, validation, swagger`.

## Phase 3 — Products & catalog API (`backend-engineer`)
Product + category schemas (name, description, price, image, category, stock). Endpoints for catalog browse with **search by name, filter by category + price range, sort by price/newest, pagination**. Product detail endpoint. Admin product **CRUD** with **local image upload** (multipart → `/uploads`, served statically; store the path/URL on the product).
**Commit:** `feat(backend): products, catalog query, image upload`.

## Phase 4 — Cart & orders API (`backend-engineer`)
Persistent per‑user cart (a returning logged‑in user sees their cart). Add/remove/update quantities, line totals + order total **computed server‑side**. Checkout that creates an order and processes a **Stripe test‑mode** (or clearly mocked) payment, then returns an order confirmation. Customer order history (own orders only). **Data integrity:** reject ordering more than stock; decrement stock on successful order; validate price server‑side.
**Commit:** `feat(backend): cart, checkout, stripe test, orders`.

## Phase 5 — Admin & analytics API (`backend-engineer`)
Admin order management with valid lifecycle transitions `pending → processing → shipped → delivered` plus a `cancelled` path (reject illegal transitions). Admin dashboard data: total sales, order count by status, top‑selling products. All admin endpoints role‑restricted.
**Commit:** `feat(backend): admin orders, status lifecycle, analytics`.

## Phase 6 — Recommendations / open‑ended requirement (`backend-engineer`)
Implement a reasonable "relevant product suggestions" feature (e.g. by shared category / from the user's order history, with a sensible fallback). **Document the interpretation and reasoning in `NOTES.md`.**
**Commit:** `feat(backend): product recommendations`.

## Phase 7 — Backend tests + Swagger polish (`backend-engineer` + `supervisor-verifier`)
A few meaningful tests on important logic (auth/role guard, order total + stock integrity, status‑transition rules). Ensure Swagger documents all endpoints.
**Commit:** `test(backend): core logic tests`.

## Phase 8 — Frontend foundation + auth (`frontend-engineer`)
Next.js app on the MUI theme. RTK Query base API with auth token handling. Login (with Customer/Admin portal tabs as in the prototype) + Signup, using RHF + Yup. Route protection: unauthenticated and wrong‑role users are redirected; admin area gated.
**Commit:** `feat(frontend): auth pages, protected routes`.

## Phase 9 — Storefront (`frontend-engineer`)
Build the storefront screens to match the prototype: catalog (search, category/price filters, sort, pagination), product detail with quantity + add‑to‑cart, cart (update/remove, line + order totals), checkout (Stripe test), order confirmation, order history, and the static Shipping/Returns/Contact pages. Use Framer Motion for transitions and Swiper for the recommendations/featured carousel.
**Commit:** `feat(frontend): storefront — catalog, product, cart, checkout, orders`.

## Phase 10 — Admin panel (`frontend-engineer`)
Admin dashboard (with at least one **chart** — e.g. sales or orders‑by‑status), product management (CRUD with image upload, including the add/view product modals from the prototype), and order management with status updates. Admin layout matches the prototype's admin design.
**Commit:** `feat(frontend): admin dashboard, product & order management`.

## Phase 11 — Integration pass (`integration-agent`)
Wire frontend to the real backend end‑to‑end. Reconcile every contract mismatch, confirm auth headers flow, and run the full journeys for both a customer and an admin. Fix breakages on whichever side is wrong and update `CLAUDE.md`.
**Commit:** `fix(integration): frontend↔backend contract alignment`.

## Phase 12 — Seed, docs, final verification (`supervisor-verifier`)
- **Seed script** that populates sample products (across categories, varied stock), **at least one admin** and **one customer**.
- **README**: prerequisites, env vars, how to run backend + frontend, and the seeded login credentials.
- **`NOTES.md`** covering everything the spec asks for: agent workflow (which agents, how you scoped/prompted/managed context via `CLAUDE.md`), where agents helped vs failed and how it was caught/corrected, supervision & verification approach, design workflow, all assumptions, the recommendation interpretation, and trade‑offs/scope (built vs mocked vs future work).
- Final gate: **clean clone into a fresh folder, follow the README exactly, confirm it runs**; run all tests; re‑check auth, validation, and data integrity.
**Commit:** `chore: seed script, README, NOTES.md, final verification`.

---

## Operating rules (apply throughout)
- Re‑read the spec before each phase; treat the HTML as the visual contract.
- One module = one commit; conventional messages; no monolithic final commit. Keep the git history coherent — it's reviewed.
- Route every module through `supervisor-verifier` before committing; it must sign off.
- Keep `CLAUDE.md`'s data model + endpoint contract current — it's how the FE and BE agents stay in sync.
- Secrets in `.env` only (provide `.env.example`); never commit real keys. Stripe stays in test mode.
- Working over polished, coherent over complete: if time is short, keep the end‑to‑end flow intact, mock the rest, and document it in `NOTES.md`.

Start with Phase 0 now: confirm the plan briefly, then scaffold the repo, write `CLAUDE.md`, and create the `.claude/` agents and skills.
