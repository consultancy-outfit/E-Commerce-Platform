# Skill: verification-checklist

The per-module gate `supervisor-verifier` runs before any commit. Report each
item PASS/FAIL with evidence.

## Build & quality
- [ ] Relevant app builds (`npm run build` in `/backend` or `/frontend`)
- [ ] Lint passes with no errors
- [ ] Relevant tests pass

## Spec & design
- [ ] Module satisfies the assessment requirement it targets
- [ ] UI matches `docs/Maison-Prototype.html` (layout, type, colour, both themes)

## Auth & authorization
- [ ] Authenticated endpoints reject anonymous requests (401)
- [ ] Admin endpoints reject customers (403)
- [ ] A customer can only read/modify their own cart and orders

## Validation (both sides)
- [ ] Server rejects bad input via DTO + ValidationPipe (400) with clear message
- [ ] Client validates with Yup before submit and shows errors

## Data integrity
- [ ] Stock cannot go negative; ordering more than stock → rejected
- [ ] Stock decrements on successful order
- [ ] Order totals (subtotal/tax/total) computed server-side, not trusted
- [ ] Order status transitions validated (illegal transitions rejected)

## Security
- [ ] Passwords hashed (bcrypt); never returned in responses
- [ ] No secrets committed; `.env.example` present, real values only in `.env`
- [ ] No raw stack traces leaked to clients

## Verdict
**SIGN-OFF** or **CHANGES REQUIRED** + ordered fix list.
