# CLAUDE.md — Maison Mini E-Commerce Platform

> Persistent project brief. **Every agent reads this before working.** Keep the
> Data Model and Endpoint Contract sections current — they are the single source
> of truth that keeps the frontend and backend in sync.

## Project summary

Maison is a full-stack mini e-commerce platform: a customer **storefront** and an
**admin panel** backed by one API. Customers browse a fashion catalog, manage a
persistent cart, check out with a Stripe test-mode payment, and view their order
history. Admins manage products (CRUD + image upload), move orders through a
status lifecycle, and view a small analytics dashboard. The UI must visually
match the Maison prototype in `docs/Maison-Prototype.html` (dark **and** light
themes). "Working over polished, coherent over complete."

## Locked tech stack

**Backend** — NestJS (modular) · MongoDB via Mongoose with a **repository
pattern** (controllers → services → repositories; no DB access in controllers) ·
JWT auth with two roles `admin` / `customer` enforced via guards · Swagger UI at
`/api/docs` · Stripe **test mode** · local filesystem image storage under
`/uploads`, served statically.

**Frontend** — Next.js (App Router) + TypeScript · MUI themed to the Maison
design tokens · RTK Query for all data fetching · React Hook Form + **Yup** for
forms/validation · Framer Motion for transitions · Swiper for carousels ·
Stripe test mode on checkout.

> NOTE: This repo pins **Next.js 16** and **NestJS 11 / Mongoose 9**, which have
> conventions newer than common training data. Read `frontend/node_modules/next/dist/docs/`
> before writing frontend framework code.

## Architecture conventions

### Backend (`/backend`)
```
src/
  common/        guards, decorators, filters, pipes, interceptors
  config/        env + config module
  auth/          auth.module/controller/service, jwt strategy, dto
  users/         schema, repository, service
  products/      schema, repository, service, controller, dto
  cart/          schema, repository, service, controller, dto
  orders/        schema, repository, service, controller, dto
  recommendations/ service, controller
  admin/         analytics service + controller (admin-only)
  seed/          seed script
```
- **Repository pattern**: each domain has a `*.repository.ts` wrapping the
  Mongoose model. Services depend on repositories, controllers depend on services.
- DTOs use `class-validator` decorators; a global `ValidationPipe`
  (`whitelist`, `forbidNonWhitelisted`, `transform`) rejects bad input.
- A global exception filter returns `{ statusCode, message, error }` — never a
  stack trace.
- Guards: `JwtAuthGuard` (authenticated), `RolesGuard` + `@Roles('admin')`.

### Frontend (`/frontend`)
```
app/                  App Router routes (route groups: (storefront), (admin), (auth))
src/
  lib/store.ts        Redux store
  lib/api/            RTK Query: baseApi + injected endpoint slices per domain
  lib/theme/          MUI theme (dark+light) from design tokens + ThemeProvider
  components/         shared base components (Button, Field, ProductCard, ...)
  features/           feature UI (catalog, product, cart, checkout, admin, ...)
  schemas/            Yup validation schemas
```
- **Feature folders**; one RTK Query slice per domain injected into `baseApi`.
- All forms use RHF + `yupResolver`.

## Data model (MongoDB collections)

**User**
| field | type | notes |
|---|---|---|
| email | string | unique, lowercased |
| passwordHash | string | bcrypt; never returned |
| firstName, lastName | string | |
| role | `'customer' \| 'admin'` | default `customer` |
| timestamps | Date | createdAt/updatedAt |

**Product**
| field | type | notes |
|---|---|---|
| name | string | required |
| description | string | |
| price | number | ≥ 0, GBP |
| category | string | one of: Dresses, Outerwear, Knitwear, Trousers, Accessories |
| image | string | `/uploads/<file>` or external URL |
| stock | number | integer ≥ 0 |
| timestamps | Date | createdAt used for "newest" sort |

**Cart** (one per user)
| field | type | notes |
|---|---|---|
| user | ObjectId | unique ref User |
| items | `[{ product: ObjectId, size: string, quantity: number }]` | |

**Order**
| field | type | notes |
|---|---|---|
| user | ObjectId | ref User |
| items | `[{ product, name, price, size, quantity }]` | price snapshotted at purchase |
| subtotal, tax, total | number | **computed server-side** (tax = 20% VAT) |
| status | `pending\|processing\|shipped\|delivered\|cancelled` | default `pending` |
| shippingAddress | object | firstName,lastName,line1,city,postcode |
| paymentRef | string | Stripe test PaymentIntent id (or mock ref) |
| timestamps | Date | |

**Status lifecycle (enforced):** `pending → processing → shipped → delivered`.
`cancelled` is reachable from `pending` or `processing`. Any other transition → 400.

## REST endpoint contract

> Verified end-to-end in Phase 11: every endpoint below matches the frontend's
> RTK Query calls (paths, payloads, auth headers, status codes).

Base URL: `http://localhost:3001`. JSON. Auth via `Authorization: Bearer <jwt>`.
Roles: 🔓 public · 👤 customer (authenticated) · 🛡️ admin.

### Auth
| method | path | role | body → response |
|---|---|---|---|
| POST | `/auth/signup` | 🔓 | `{email,password,firstName,lastName}` → `{accessToken, user}` |
| POST | `/auth/login` | 🔓 | `{email,password}` → `{accessToken, user}` |
| GET | `/auth/me` | 👤 | → `{id,email,firstName,lastName,role}` |

### Products / catalog
| method | path | role | notes |
|---|---|---|---|
| GET | `/products` | 🔓 | query: `search, category, minPrice, maxPrice, sort(newest\|price-asc\|price-desc), page, limit` → `{items, total, page, pageCount}` |
| GET | `/products/:id` | 🔓 | → product |
| GET | `/products/:id/recommendations` | 🔓 | → `Product[]` (≤4) |
| POST | `/products` | 🛡️ | multipart (`image` file) or JSON → product |
| PATCH | `/products/:id` | 🛡️ | partial update (multipart/JSON) → product |
| DELETE | `/products/:id` | 🛡️ | → `{ success: true }` |
| POST | `/products/upload` | 🛡️ | multipart `image` → `{ url }` (optional standalone upload) |

### Cart (own cart only)
| method | path | role | notes |
|---|---|---|---|
| GET | `/cart` | 👤 | → cart with populated products + line/total amounts |
| POST | `/cart/items` | 👤 | `{productId,size,quantity}` → cart |
| PATCH | `/cart/items` | 👤 | `{productId,size,quantity}` (absolute qty) → cart |
| DELETE | `/cart/items` | 👤 | `{productId,size}` → cart |

### Orders
| method | path | role | notes |
|---|---|---|---|
| POST | `/orders/checkout` | 👤 | `{shippingAddress, payment:{...test}}` → order; validates stock, computes totals, decrements stock, clears cart |
| GET | `/orders` | 👤 | own orders only → `Order[]` |
| GET | `/orders/:id` | 👤 | own order → order |

### Admin
| method | path | role | notes |
|---|---|---|---|
| GET | `/admin/orders` | 🛡️ | all orders → `Order[]` |
| PATCH | `/admin/orders/:id/status` | 🛡️ | `{status}` → order (validated transition) |
| GET | `/admin/analytics` | 🛡️ | → `{totalSales, orderCount, ordersByStatus, topProducts}` |

## Coding standards
- Validate on **both** client (Yup) and server (class-validator).
- Meaningful HTTP status codes (400/401/403/404/409). No stack traces to clients.
- No secrets in the repo — use `.env` + commit `.env.example`. Stripe stays in
  test mode.
- Passwords hashed with bcrypt; never stored or returned in plain text.
- Money and stock are computed/validated server-side; never trust client totals.

## Commit policy
- **One module = one commit**, conventional messages
  (`feat(scope): …`, `fix(...)`, `test(...)`, `chore: …`).
- No monolithic "final commit". The git history is reviewed.
- Route each module through the `supervisor-verifier` checklist before committing.

## Design-fidelity rule
The UI must match `docs/Maison-Prototype.html`: same layout, typography
(Marcellus headings, Hanken Grotesk body), colours (crimson `#C8203F`, gold
`#C9A24B`, success `#4FA77E`), surfaces, borders, radii, and **both** dark and
light themes. Do not invent a different look or drop in a template.
