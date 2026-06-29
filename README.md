# Maison — Mini E-Commerce Platform

A full-stack mini e-commerce platform: a customer **storefront** and an **admin
panel** sharing one API.

- **Backend** — NestJS · MongoDB/Mongoose (repository pattern) · JWT auth
  (customer/admin roles) · Swagger at `/api/docs` · Stripe test mode · local
  image uploads served from `/uploads`.
- **Frontend** — Next.js (App Router) + TypeScript · MUI (custom Maison theme,
  dark + light) · RTK Query · React Hook Form + Yup · Framer Motion · Swiper.

See `CLAUDE.md` for the architecture + full API contract, and `NOTES.md` for the
agent workflow, assumptions, and trade-offs.

## Repo layout
```
/backend     NestJS API
/frontend    Next.js app
/docs        spec + design prototype (reference)
/.claude     subagents + skills that drove the build
CLAUDE.md    persistent project brief: data model + endpoint contract
NOTES.md     agent workflow, assumptions, trade-offs
```

## Prerequisites
- **Node.js** 18+ (LTS recommended)
- **MongoDB** running locally (default `mongodb://127.0.0.1:27017`), or a
  connection string to a remote instance
- npm

## 1. Backend

```bash
cd backend
npm install
cp .env.example .env        # then edit if needed (see below)
npm run seed                # resets the db + inserts users and products
npm run start:dev           # http://localhost:3001  (Swagger at /api/docs)
```

**Backend environment (`backend/.env`)**

| var | default | notes |
|---|---|---|
| `PORT` | `3001` | API port |
| `CORS_ORIGIN` | `http://localhost:3000` | storefront origin |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/maison` | Mongo connection |
| `JWT_SECRET` | — | **required**; any long random string for dev |
| `JWT_EXPIRES_IN` | `7d` | token lifetime |
| `STRIPE_SECRET_KEY` | _(blank)_ | Stripe **test** secret key; blank → built-in mock payment |
| `UPLOAD_DIR` | `uploads` | where product images are written |

> Payments: with a Stripe **test** secret key set, checkout creates and confirms
> a test PaymentIntent. Left blank (the default), checkout uses a clearly
> labelled mock so the flow always works. No real charge is ever made.

## 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local  # NEXT_PUBLIC_API_URL=http://localhost:3001
npm run dev                 # http://localhost:3000
```

Open **http://localhost:3000**.

## Seeded login credentials

| role | email | password |
|---|---|---|
| Admin | `admin@maison.com` | `Admin123!` |
| Customer | `elise.moreau@gmail.com` | `Customer123!` |

The login page has **Customer** and **Admin** portal tabs and pre-fills the
matching demo credentials. You can also sign up a new customer, or browse as a
guest (add-to-cart prompts you to sign in).

## Tests

```bash
cd backend && npm test     # unit tests (pricing, status lifecycle, auth, role
                           # guard, checkout integrity)
```

## What to try
- **Storefront**: browse the catalog (search, category + price filters, sort,
  pagination), open a product (size + quantity, recommendations carousel), add
  to cart, checkout (test payment), see the confirmation and order history.
- **Admin** (`/admin`): dashboard (sales, orders-by-status donut, top sellers),
  product management (add/edit/delete with image upload), order management
  (advance status through its lifecycle).
- Toggle dark/light theme from the header (top-right).
