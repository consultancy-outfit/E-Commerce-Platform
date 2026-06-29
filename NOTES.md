# NOTES.md — Maison Build Notes

> Living document, written as the build progresses (per the assessment's
> instruction to write notes as you go). Final polish happens in Phase 12.

## Agent workflow

**Tool:** Claude Code, driven through a multi-subagent workflow defined in
`.claude/`. A root `CLAUDE.md` is the persistent project brief and the single
source of truth for the data model and REST endpoint contract — both the
frontend and backend agents read it, so the two halves stay in sync without me
re-explaining the contract each time.

**Subagents** (`.claude/agents/`): `backend-engineer`, `frontend-engineer`,
`design-system-agent`, `integration-agent`, and a compulsory `supervisor-verifier`
gatekeeper. **Skills** (`.claude/skills/`): `backend-conventions`,
`frontend-conventions`, and the `verification-checklist` the supervisor runs.

**How work is scoped:** the build follows the 12-phase plan in
`docs/KICKOFF-PROMPT.md`. Each phase is one focused module dispatched to the
relevant subagent, verified against the checklist, then committed with a
conventional message. One module = one commit; no monolithic final commit.

## Where the agent helped / where it failed

**Phase 4 — two real bugs caught by live verification (not by the build):**

1. *Cart `findOrCreate` race / duplicate-key 500.* The first implementation did
   `findOne` then `create`. Because the cart has a unique `user` index and the
   string `userId` wasn't matching the stored `ObjectId` (see #2), `findOne`
   returned null on every write, so each add re-attempted an insert and hit
   `E11000 duplicate key`. Caught by exercising add-to-cart against Mongo (the
   `tsc` build was clean). Fixed with an atomic `findOneAndUpdate(..., {upsert})`.

2. *String `userId` not matching `ObjectId` fields.* `cart.clear` and
   `orders.findByUser` filtered with a raw string `userId` on an `ObjectId` ref
   field, which returned no match in this Mongoose version. Symptoms: cart not
   cleared after checkout, and `GET /orders` returning `[]` while the order
   clearly existed (and a second checkout then ran on the un-cleared cart,
   double-decrementing stock). `_id`-based queries were unaffected because `_id`
   is always cast. Caught by asserting post-checkout state (cart count, stock
   delta, order list) rather than trusting the 201 response. Fixed by casting
   `new Types.ObjectId(userId)` in those queries.

**Lesson applied:** verify *side effects against the database*, not just HTTP
status codes — both bugs returned plausible-looking success responses.

## Supervision & verification
The `supervisor-verifier` checklist (build/lint/tests, auth/authz, validation on
both sides, data integrity, security) gates each module. Backend modules were
verified **live against MongoDB** with scripted request sequences (not just by
the build), which is how the Phase 4 bugs were caught. The frontend was gated by
`tsc --noEmit` + `next build` each phase.

**Phase 11 — integration pass.** With both apps running, I replayed the exact
request sequences the frontend issues, for both journeys:
- *Customer*: signup → browse (search/sort/paginate) → product detail +
  recommendations → add to cart → checkout → order history — all green; totals
  server-computed (e.g. £172×2 = £344 → £412.80 with VAT).
- *Admin*: analytics → all orders → advance status → create product via
  multipart **file upload** → edit → delete — all green.
- *Authorization*: a customer token gets **403** on `/admin/*` and `POST
  /products`, and a customer cannot read another user's order (403); own order
  returns 200.
- The Next app boots and serves `/login`, `/catalog`, `/admin` (200) and `/`
  redirects to `/catalog`.

**No contract mismatches were found** — both halves were built against the
single contract in `CLAUDE.md`, so they aligned. CORS allows the storefront
origin; the JWT flows on every authenticated request.

## Design workflow
The UI was designed up front in a standalone HTML prototype
(`docs/Maison-Prototype.html`) produced via design tooling, then extracted into a
reusable MUI theme (dark + light tokens, Marcellus/Hanken Grotesk fonts, crimson
`#C8203F` / gold `#C9A24B` accents) by the `design-system-agent`. The React UI is
built to match it screen-for-screen rather than dropping in a template.

## Assumptions
- **Tax**: 20% UK VAT, shown as "Estimated tax", computed server-side.
- **Sizes**: products carry a fixed size set (XS/S/M/L); size is a cart-line
  attribute, not separate stock per size (kept simple for scope).
- **Images**: stored on the local filesystem under `/uploads` and served
  statically; external image URLs are also accepted (seed data uses Unsplash).
- (more recorded per phase)

## Open-ended requirement — "relevant product suggestions"
**Interpretation:** "relevant" = visually/contextually similar items a shopper is
likely to consider next. Implemented as: same category as the product being
viewed, ranked by price proximity, with a fallback that fills up to 4 from the
rest of the catalog so the rail is never empty. Rationale and any later
refinements documented in Phase 6.

## Trade-offs & scope
<!-- Built fully vs mocked vs future work — filled in Phase 12. -->
