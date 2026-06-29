# Maison — Mini E-Commerce Platform

A full-stack mini e-commerce platform: a customer **storefront** and an **admin
panel** sharing one API.

- **Backend** — NestJS · MongoDB/Mongoose (repository pattern) · JWT auth
  (customer/admin roles) · Swagger at `/api/docs` · Stripe test mode · local
  image uploads.
- **Frontend** — Next.js (App Router) + TypeScript · MUI (custom Maison theme,
  dark + light) · RTK Query · React Hook Form + Yup · Framer Motion · Swiper.

> Full setup instructions, environment variables, and seeded credentials are
> documented in Phase 12. See `CLAUDE.md` for the architecture and API contract,
> and `NOTES.md` for the build/agent workflow.

## Repo layout
```
/backend     NestJS API
/frontend    Next.js app
/docs         spec + design prototype (reference)
/.claude      subagents + skills driving the build
CLAUDE.md    persistent project brief: data model + endpoint contract
NOTES.md     agent workflow, assumptions, trade-offs
```
