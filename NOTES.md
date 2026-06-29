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
<!-- Fill in per phase: subtle mistakes caught, how, and the correction. -->

## Supervision & verification
The `supervisor-verifier` checklist (build/lint/tests, auth/authz, validation on
both sides, data integrity, security) gates each module. Specific verifications
recorded per phase below.

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
