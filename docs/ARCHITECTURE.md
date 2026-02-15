# Campus-Voice — Architecture Guide

> **Stage**: Frontend-only (mock data). Supabase integration planned.

---

## 1. Tech Stack

| Layer         | Technology                                            |
| ------------- | ----------------------------------------------------- |
| Framework     | Next.js 15.5 (App Router)                             |
| Language      | TypeScript 5                                          |
| Styling       | Tailwind CSS v4 + CSS Variables (dark / light themes) |
| Components    | shadcn/ui (new-york style) on Radix primitives        |
| Animations    | Framer Motion                                         |
| Charts        | Recharts                                              |
| Notifications | Sonner (toast)                                        |
| Theme         | next-themes                                           |

---

## 2. Directory Layout

```
src/
├── app/                         # Next.js App Router pages
│   ├── layout.tsx               # Root layout (ThemeProvider, AppProvider, Toaster)
│   ├── page.tsx                 # Public landing page
│   ├── globals.css              # Global styles, CSS variables, Tailwind
│   ├── login/page.tsx           # Login page (no real auth yet)
│   └── (dashboard)/             # Route group — all authenticated pages
│       ├── layout.tsx           # Dashboard shell (sidebar + navbar)
│       ├── dashboard/page.tsx   # Student dashboard
│       ├── admin/page.tsx       # Admin console (issues, users, audit logs)
│       ├── faculty/page.tsx     # Faculty overview (analytics, action items)
│       ├── issues/page.tsx      # Issue list (grid / list view)
│       ├── issues/[id]/page.tsx # Issue detail (timeline, admin chat)
│       ├── report/              # Multi-step issue report wizard
│       └── locations/page.tsx   # Location management (tree view)
│
├── components/                  # Shared React components
│   ├── landing/                 # Landing page sections
│   ├── ui/                      # shadcn/ui primitives (do not edit)
│   ├── app-context.tsx          # AppProvider (role, sidebar state)
│   ├── app-sidebar.tsx          # Sidebar navigation
│   ├── app-navbar.tsx           # Top navbar
│   ├── app-shell.tsx            # Dashboard layout wrapper
│   ├── issue-card.tsx           # Issue card (grid view)
│   ├── issue-list-item.tsx      # Issue row (list view)
│   ├── timeline.tsx             # Issue status timeline
│   ├── admin-chat.tsx           # Issue admin update log
│   ├── audit-log.tsx            # System audit log table
│   ├── user-management-table.tsx# Admin user table
│   ├── analytics-charts.tsx     # Faculty analytics (bar, pie, area)
│   ├── faculty-action-items.tsx # Faculty pending action items
│   ├── location-tree.tsx        # Recursive location tree
│   └── location-stats.tsx       # Location issue statistics
│
├── lib/
│   ├── utils.ts                 # Tailwind merge helper
│   └── mock/                    # 🟢 Single source of truth for mock data
│       ├── index.ts             # Re-exports everything
│       ├── types.ts             # Shared TypeScript interfaces
│       ├── constants.ts         # Colour maps, filter arrays
│       ├── issues.ts            # Issue list + detail page data
│       ├── users.ts             # User directory
│       ├── audit-logs.ts        # Audit log entries
│       ├── locations.ts         # Campus location tree + categories
│       └── analytics.ts         # Chart data, sentiment, department stats
│
└── hooks/
    └── use-mobile.ts            # Mobile breakpoint hook
```

---

## 3. State Management

| Concern       | Mechanism                                                                             |
| ------------- | ------------------------------------------------------------------------------------- |
| User Role     | `AppProvider` context (`useApp()`) + localStorage                                     |
| Theme         | `next-themes` (ThemeProvider)                                                         |
| Sidebar State | `AppProvider` context                                                                 |
| Page State    | Local `useState` per page                                                             |
| Server State  | None yet — all data is mock. Will migrate to Supabase + React Query / Server Actions. |

---

## 4. Routing & Access

| Route          | Role Guard | Description                 |
| -------------- | ---------- | --------------------------- |
| `/`            | Public     | Landing page                |
| `/login`       | Public     | Login (mock role selection) |
| `/dashboard`   | Student    | Student dashboard           |
| `/admin`       | Admin      | Admin console               |
| `/faculty`     | Faculty    | Faculty overview            |
| `/issues`      | All roles  | Issue list                  |
| `/issues/[id]` | All roles  | Issue detail                |
| `/report`      | All roles  | Report new issue            |
| `/locations`   | Admin      | Location management         |

> **Note**: No middleware or real auth exists yet. Role is stored in
> localStorage and toggled via the sidebar. Route protection will be
> added with Supabase Auth + Next.js middleware.

---

## 5. Planned Database Schema (Supabase)

```
profiles
  id          uuid (PK, FK → auth.users)
  role        enum (student, faculty, admin)
  dept        text
  created_at  timestamptz

issues
  id          serial (PK)
  title       text
  description text
  status      enum (submitted, under_review, in_progress, resolved)
  priority    enum (critical, high, medium, low)
  category    text
  location    text
  reporter_id uuid (FK → profiles, nullable for anonymous)
  assigned_to text
  upvotes     int default 0
  progress    int default 0
  created_at  timestamptz
  updated_at  timestamptz

issue_updates
  id          serial (PK)
  issue_id    int (FK → issues)
  author      text
  message     text
  type        enum (system, assign, update, critical)
  created_at  timestamptz

issue_votes
  id          serial (PK)
  issue_id    int (FK → issues)
  user_id     uuid (FK → profiles)
  created_at  timestamptz
  UNIQUE (issue_id, user_id)

locations
  id          text (PK)
  name        text
  type        enum (campus, block, lab, hostel, facility)
  parent_id   text (FK → locations, nullable)
  issue_count int default 0

audit_logs
  id          serial (PK)
  action      text
  admin_id    uuid (FK → profiles)
  type        enum (resolve, assign, escalate, update, system)
  created_at  timestamptz
```

---

## 6. Migration Path (Mock → Supabase)

1. Each file in `src/lib/mock/` maps to one or more DB tables.
2. Replace mock imports with Supabase client queries or Server Actions.
3. Types in `src/lib/mock/types.ts` will be replaced by generated
   Supabase types (`npx supabase gen types typescript`).
4. Colour constants in `constants.ts` remain client-side — they are
   UI-only and do not move to the database.

---

## 7. Build & Development

```bash
npm run dev       # Start dev server (localhost:3000)
npm run build     # Production build (TS strict, no ignoreErrors)
npm run lint      # ESLint (next/core-web-vitals + next/typescript)
```

---

_Last updated: $(date +%Y-%m-%d) — pre-backend stabilisation PR_
