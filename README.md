# Stonegate Moving Solutions - Technical Documentation

Full-stack web application for an apartment moving company. Customers can fill out a moving order form, create an account, confirm their order, and have it saved to a database while the owner receives an email notification.

---

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables and fill in your keys
cp .env.local.example .env.local

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Table of Contents

1. [Tech Stack](#1-tech-stack)
2. [Architecture Overview](#2-architecture-overview)
3. [File Structure](#3-file-structure)
4. [Database Design](#4-database-design)
5. [Authentication](#5-authentication)
6. [The Order Flow](#6-the-order-flow)
7. [Pages](#7-pages)
8. [API Routes](#8-api-routes)
9. [Security Model](#9-security-model)
10. [Environment Variables](#10-environment-variables)
11. [Setup Guide](#11-setup-guide)
12. [Deployment](#12-deployment)
13. [Extending the Project](#13-extending-the-project)

---

## 1. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router, TypeScript) | 16.2.6 |
| UI | React | 19.2.4 |
| Styling | Tailwind CSS v4 + shadcn/ui | v4 |
| Database + Auth | Supabase (PostgreSQL) | @supabase/ssr 0.10.3 |
| Email | Resend | latest |
| Deployment | Vercel | — |
| AI Agent (future) | Python service (separate repo) | placeholder only |

### What Each Tool Does

**Next.js 16 (App Router)**
Next.js is the core framework built on top of React. It adds routing, server-side rendering, API endpoints, and static page generation. The App Router organises pages by folder structure inside `app/` — every folder with a `page.tsx` becomes a URL route automatically. It distinguishes between Server Components (run on the server) and Client Components (run in the browser, marked with `'use client'`).

**TypeScript**
JavaScript with a type system. Prevents entire categories of bugs at compile time before you ever run the code. All types for shared data structures are defined in `lib/types.ts`.

**Tailwind CSS v4**
Utility-first CSS framework. Styles are applied as class names directly on elements. Version 4 has no `tailwind.config.ts` — all theme configuration lives in `globals.css` using CSS variables.

**shadcn/ui**
Not a traditional component library — it copies component source code directly into `components/ui/` when you run `npx shadcn@latest add <component>`. You own and can modify every component. Built on Radix UI (accessible headless primitives) and styled with Tailwind.

**Supabase**
Backend-as-a-service built on PostgreSQL. Provides a managed database, built-in authentication (email/password), Row Level Security, and a web dashboard to inspect data. The `@supabase/ssr` package makes Supabase work correctly with server-side rendering by handling session cookies on both browser and server.

**Resend**
Email delivery API. When an order is confirmed, the server calls Resend's API with an HTML string and Resend delivers it to the owner's inbox. Free tier: 3,000 emails/month.

**Vercel**
Hosting platform that connects to GitHub and auto-deploys on every push. Next.js API routes run as serverless functions — they spin up on demand, handle a request, and shut down. No server to manage.

---

## 2. Architecture Overview

```
Browser (user's device)
    │
    │  HTTP requests
    ▼
Vercel Edge Network (CDN + serverless)
    │
    ├── proxy.ts               ← Runs on EVERY request before any page
    │                             (checks auth, redirects if needed)
    │
    ├── Static pages           ← Pre-rendered HTML served from CDN instantly
    │   (/, /order, /login, /register, /agent, /order/success)
    │
    └── API routes             ← Serverless functions, run on demand
        ├── /api/auth/callback    ← Handles Supabase email confirmation
        └── /api/orders           ← Saves order, sends email
              │
              ├── Supabase (PostgreSQL)   ← Stores users and orders
              └── Resend                  ← Delivers email to owner's inbox
```

The browser also communicates **directly** with Supabase for authentication (login, register) — this bypasses your Vercel app entirely and goes straight to Supabase's servers. Your Vercel backend only touches Supabase to verify sessions server-side or read/write database rows.

---

## 3. File Structure

```
/
├── app/                              All pages and API routes
│   ├── layout.tsx                    Root layout — wraps every page, sets fonts and metadata
│   ├── page.tsx                      Homepage (/) — renders Hero component
│   ├── globals.css                   Tailwind v4 import + CSS variable theme
│   │
│   ├── (auth)/                       Route group — parentheses mean this folder does NOT
│   │   │                             appear in the URL (/login not /auth/login)
│   │   ├── login/page.tsx            → /login
│   │   └── register/page.tsx         → /register
│   │
│   ├── order/
│   │   ├── page.tsx                  → /order (3-step order form)
│   │   ├── confirm/page.tsx          → /order/confirm (review + confirm)
│   │   └── success/page.tsx          → /order/success (booking confirmed)
│   │
│   ├── agent/
│   │   └── page.tsx                  → /agent (AI assistant placeholder)
│   │
│   └── api/                          Backend API routes (serverless functions)
│       ├── auth/callback/route.ts    GET  /api/auth/callback
│       └── orders/route.ts           POST /api/orders
│
├── components/
│   ├── ui/                           shadcn/ui primitives (auto-generated)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── textarea.tsx
│   │   ├── badge.tsx
│   │   └── separator.tsx
│   │
│   ├── landing/
│   │   └── Hero.tsx                  Full landing page UI
│   │
│   ├── auth/
│   │   ├── LoginForm.tsx             Login form logic + UI
│   │   └── RegisterForm.tsx          Register form logic + UI
│   │
│   └── order/
│       ├── OrderForm.tsx             3-step form with step indicator and validation
│       └── OrderSummary.tsx          Read-only order summary card (confirm page)
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 Supabase client for browser (client components)
│   │   └── server.ts                 Supabase client for server (API routes)
│   ├── email.ts                      Resend client + HTML email template
│   ├── types.ts                      Shared TypeScript types (OrderFormData, etc.)
│   └── utils.ts                      shadcn cn() helper (merges Tailwind class names)
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql    Full DB schema — run once in Supabase SQL Editor
│
├── proxy.ts                          Auth route protection (Next.js 16 middleware)
├── next.config.ts                    Next.js configuration
├── tsconfig.json                     TypeScript compiler configuration
├── components.json                   shadcn/ui configuration
├── .env.local                        Secret keys — NOT committed to git
├── .env.local.example                Template showing required keys — committed
└── package.json                      Dependencies and npm scripts
```

---

## 4. Database Design

### `auth.users` (managed by Supabase)
Never created or managed manually. Supabase handles password hashing, session tokens, and email confirmation internally. Accessed only through the Supabase Auth SDK.

### `profiles`
Extension of the user record. A database trigger (`handle_new_user`) automatically creates a matching row every time a new user registers, copying over their `id` and `email`.

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK — same as auth.users.id |
| email | TEXT | Copied from auth at signup |
| full_name | TEXT | Filled in at registration |
| phone | TEXT | Optional |
| created_at | TIMESTAMPTZ | Auto-set |
| updated_at | TIMESTAMPTZ | Auto-updated via trigger |

### `orders`
One row per confirmed order.

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK, auto-generated |
| user_id | UUID | FK → profiles.id |
| phone | TEXT | |
| pickup_address | TEXT | |
| pickup_floor | INT | Default 1 |
| pickup_has_elevator | BOOLEAN | |
| dropoff_address | TEXT | |
| dropoff_floor | INT | Default 1 |
| dropoff_has_elevator | BOOLEAN | |
| apartment_size | TEXT | studio / 1br / 2br / 3br / 4br+ |
| moving_date | DATE | |
| special_notes | TEXT | Nullable |
| status | TEXT | pending / confirmed / in_progress / completed / cancelled |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | Auto-updated via trigger |

### Row Level Security (RLS)
Enabled on both tables. Database queries are automatically filtered based on who is making the request — even if a bug in the code tried to fetch all orders, Supabase would only return rows belonging to the authenticated user.

| Table | Operation | Policy |
|---|---|---|
| profiles | SELECT | `auth.uid() = id` |
| profiles | UPDATE | `auth.uid() = id` |
| orders | SELECT | `auth.uid() = user_id` |
| orders | INSERT | `auth.uid() = user_id` |

---

## 5. Authentication

### Two Supabase Clients

**`lib/supabase/client.ts`** — for Client Components (browser)
Uses `createBrowserClient` from `@supabase/ssr`. Reads session cookies from the browser. Used in `LoginForm.tsx` and `RegisterForm.tsx`.

**`lib/supabase/server.ts`** — for Server Components and API routes
Uses `createServerClient` from `@supabase/ssr` with `cookies()` from `next/headers`. Reads session cookies from the incoming HTTP request. Used in `app/api/orders/route.ts` to verify authentication server-side.

### Registration Flow
1. User fills in name, email, password on `/register`
2. `supabase.auth.signUp()` called from the browser
3. Supabase creates the user in `auth.users`, hashes the password (bcrypt internally)
4. Supabase sends a confirmation email with a link to `/api/auth/callback?code=xxx&next=/order/confirm`
5. User clicks the link
6. `GET /api/auth/callback` runs on the server, calls `supabase.auth.exchangeCodeForSession(code)`, sets the session cookie
7. Route redirects to `/order/confirm`

### Login Flow
1. User submits email + password on `/login`
2. `supabase.auth.signInWithPassword()` called from the browser
3. Supabase validates credentials, returns a session
4. `@supabase/ssr` writes the session as a cookie
5. Page redirects to the `next` parameter

### Session Security
Sessions are stored in **httpOnly cookies** — JavaScript running in the browser cannot read them, only the server can. This protects against XSS attacks. `proxy.ts` runs on every request and calls `supabase.auth.getUser()` to validate and refresh the session token before it expires.

### Route Protection
`proxy.ts` checks if the requested path is `/order/confirm` or `/order/success`. If no valid session exists, the user is redirected to `/register?next=/order/confirm`. The `next` parameter ensures they land back where they were after authenticating.

---

## 6. The Order Flow

### Step 1 — Form (client-side only)
`OrderForm` keeps all data in React `useState`. Nothing is sent to the server as the user fills in the 3 steps. All data lives in the browser's memory.

### Step 2 — Save to sessionStorage
On the final step, form data is serialised to JSON and saved to `sessionStorage` under the key `pendingOrder`. sessionStorage persists for the duration of the browser tab — it's used as a handoff mechanism between the form page and the confirm page.

### Step 3 — Auth check
After saving, the form checks if the user is logged in via the browser Supabase client. If not → `/register?next=/order/confirm`. If yes → `/order/confirm`.

### Step 4 — Confirm page reads sessionStorage
On mount (`useEffect`), the confirm page reads `pendingOrder` from sessionStorage. If nothing is there (direct navigation), it redirects back to `/order`.

### Step 5 — POST /api/orders
User clicks "Confirm Order":
1. `fetch('/api/orders', { method: 'POST', body: JSON.stringify(order) })`
2. Server verifies Supabase session (401 if unauthenticated)
3. Validates required fields (400 if missing)
4. Inserts row into `orders` table linked to the user's ID
5. Fetches user's profile for email content
6. Calls `sendOwnerOrderNotification()` from `lib/email.ts`
7. Returns `{ orderId }` to the browser

### Step 6 — Email via Resend
`lib/email.ts` builds an HTML table with all order details and calls `resend.emails.send()`. Wrapped in `try/catch` — if Resend fails, the order is still saved and only the notification fails (logged to console).

### Step 7 — Success
Browser receives `{ orderId }`, clears sessionStorage, navigates to `/order/success`.

---

## 7. Pages

| Route | File | Type | Description |
|---|---|---|---|
| `/` | `app/page.tsx` + `components/landing/Hero.tsx` | Static | Landing page — nav, hero, how-it-works, CTA, footer |
| `/order` | `app/order/page.tsx` + `components/order/OrderForm.tsx` | Client | 3-step form wizard with step indicator |
| `/order/confirm` | `app/order/confirm/page.tsx` | Client | Order summary + confirm button. Protected. |
| `/order/success` | `app/order/success/page.tsx` | Static | Booking confirmed screen |
| `/login` | `app/(auth)/login/page.tsx` | Client | Login form via Supabase Auth |
| `/register` | `app/(auth)/register/page.tsx` | Client | Register form + email confirmation state |
| `/agent` | `app/agent/page.tsx` | Static | AI assistant placeholder (coming soon) |

---

## 8. API Routes

### `GET /api/auth/callback`
**File:** `app/api/auth/callback/route.ts`

Called by Supabase after a user clicks their confirmation email link. Receives a `code` query parameter, exchanges it for a session via `supabase.auth.exchangeCodeForSession(code)`, then redirects to the `next` query parameter. This is the bridge between Supabase's email system and the app's session.

### `POST /api/orders`
**File:** `app/api/orders/route.ts`

The only write endpoint. Full sequence:
1. Auth check — returns `401` if no valid session
2. JSON body parsing — returns `400` if malformed
3. Required field validation — returns `400` if any required field is missing
4. Insert into `orders` table — returns `500` if DB fails
5. Fetch user profile for email content
6. Send Resend notification (non-blocking — errors are logged, not returned)
7. Return `{ orderId }` with status `201`

---

## 9. Security Model

| Threat | Defence |
|---|---|
| Unauthenticated order submission | API route verifies Supabase session server-side before any DB write |
| User reading another user's orders | Row Level Security at DB level — Supabase filters automatically |
| Session token theft via XSS | Sessions in httpOnly cookies — inaccessible to JavaScript |
| Expired sessions | `proxy.ts` refreshes session token on every request |
| Secret keys exposed to browser | `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `OWNER_EMAIL` have no `NEXT_PUBLIC_` prefix — Next.js never sends them to the browser |
| `.env.local` committed to git | `.gitignore` includes `.env*` |

---

## 10. Environment Variables

| Variable | Used In | Exposed to Browser |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Both Supabase clients | Yes — safe, needed by browser |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Both Supabase clients | Yes — safe, RLS enforces access |
| `SUPABASE_SERVICE_ROLE_KEY` | Future admin routes | No — bypasses RLS, never expose |
| `RESEND_API_KEY` | `lib/email.ts` | No |
| `RESEND_FROM_EMAIL` | `lib/email.ts` | No |
| `OWNER_EMAIL` | `lib/email.ts` | No |
| `NEXT_PUBLIC_APP_URL` | Register form redirect | Yes |

`NEXT_PUBLIC_` prefix means Next.js embeds the value into the browser JavaScript bundle. Variables without that prefix exist only on the server.

---

## 11. Setup Guide

### Step 1 — Environment file
```bash
cp .env.local.example .env.local
```

### Step 2 — Supabase
1. Go to [supabase.com](https://supabase.com) → New Project
2. **Settings → API** → copy Project URL and anon key into `.env.local`
3. Copy the service_role key into `.env.local`
4. **SQL Editor → New Query** → paste contents of `supabase/migrations/001_initial_schema.sql` → Run
5. **Authentication → URL Configuration → Redirect URLs** → add `http://localhost:3000/api/auth/callback`

### Step 3 — Resend
1. Go to [resend.com](https://resend.com) → sign up
2. **API Keys → Create API Key** → paste into `.env.local`
3. For development: set `RESEND_FROM_EMAIL=onboarding@resend.dev` (no domain needed)
4. Set `OWNER_EMAIL` to your email address

### Step 4 — Run locally
```bash
npm run dev
```

---

## 12. Deployment

### Vercel
1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub → select this repo
3. **Environment Variables** → add all 7 variables from `.env.local`
4. Deploy
5. Add your production URL (e.g. `https://yourapp.vercel.app/api/auth/callback`) to Supabase Auth Redirect URLs

### What Vercel Does on Deploy
1. Clones the repo and runs `npm run build`
2. Static pages are rendered to HTML once and stored on the CDN
3. API routes are bundled as serverless function packages
4. `proxy.ts` is compiled as a Vercel Edge Function (runs at the network edge, closest to the user)
5. On first request to an API route, Vercel spins up the serverless function, handles the request, keeps it warm for subsequent requests

---

## 13. Extending the Project

### Admin Dashboard
1. Add `role TEXT DEFAULT 'customer'` column to `profiles`
2. Set `role = 'admin'` for your own account in the Supabase dashboard
3. Add RLS policy: `FOR SELECT ON orders TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))`
4. Add `/admin` to protected paths in `proxy.ts` with a role check
5. Build `app/admin/page.tsx` as a server component fetching all orders

### Python AI Agent
The Python service exposes a chat endpoint. Add a proxy route in Next.js to keep the service URL secret from the browser:
```ts
// app/api/agent/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json()
  const response = await fetch(process.env.AI_AGENT_URL + '/chat', {
    method: 'POST',
    body: JSON.stringify(body),
  })
  return response
}
```

### Stripe Payments
1. Add `estimated_price DECIMAL(10,2)` to the `orders` table
2. Install the `stripe` package
3. Add `app/api/checkout/route.ts` to create a Stripe Payment Intent
4. Add a payment step between `/order/confirm` and final submission

### SMS Notifications
Install `twilio` and add a `sendOwnerSmsNotification()` function in `lib/sms.ts`, called alongside the Resend email in `app/api/orders/route.ts`.
