# Campus-Voice — Backend Integration Plan

> **Status**: Pre-integration. All scaffolding is in place; mock data still drives the UI.

---

## 1. Database Tables (Supabase / Postgres)

| Table           | PK            | Key Columns                                                                                           | Notes                       |
| --------------- | ------------- | ----------------------------------------------------------------------------------------------------- | --------------------------- |
| `profiles`      | `id` (uuid)   | role, dept, created_at                                                                                | FK → auth.users             |
| `issues`        | `id` (serial) | title, description, status, priority, category, location, reporter_id, assigned_to, upvotes, progress | reporter_id nullable (anon) |
| `issue_updates` | `id` (serial) | issue_id, author, message, type, created_at                                                           | FK → issues                 |
| `issue_votes`   | `id` (serial) | issue_id, user_id, created_at                                                                         | UNIQUE(issue_id, user_id)   |
| `issue_flags`   | `id` (serial) | issue_id, user_id, reason, created_at                                                                 | FK → issues, profiles       |
| `locations`     | `id` (text)   | name, type, parent_id, issue_count                                                                    | Self-referencing FK         |
| `audit_logs`    | `id` (serial) | action, admin_id, type, created_at                                                                    | FK → profiles               |

TypeScript types for all tables live in `src/types/db.ts`.

---

## 2. Row-Level Security (RLS) Rules

| Table           | Policy                                                                |
| --------------- | --------------------------------------------------------------------- |
| `profiles`      | Users can read own profile. Admins can read all.                      |
| `issues`        | Anyone can read. `reporter_id` is hidden from non-admin roles (view). |
| `issue_updates` | Anyone can read. Only assigned faculty/admin can insert.              |
| `issue_votes`   | Authenticated users can insert (one per issue). Read own votes.       |
| `issue_flags`   | Authenticated users can insert. Only admins can read.                 |
| `locations`     | Anyone can read. Only admins can insert/update/delete.                |
| `audit_logs`    | Only admins can read. System inserts via service role.                |

**Student anonymity**: `reporter_id` is nullable — anonymous reports have no FK. RLS policy on `issues` hides `reporter_id` column for non-admin `SELECT` queries (use a Postgres view or column-level security).

**Faculty visibility**: Faculty can see issues in their department. Implement via RLS policy filtering on `profiles.dept = issues.category` or a junction table.

**Admin transparency**: All admin actions are logged to `audit_logs` via a Postgres trigger or application-level insert.

---

## 3. Service Layer

All data access goes through `src/lib/services/`. Each function:

- Is `async` and returns `ApiResponse<T>` (from `src/lib/api/index.ts`)
- Currently returns mock data from `src/lib/mock/`
- Has a `// TODO` comment marking where to swap to Supabase

**Existing service functions** (in `src/lib/services/issues.ts`):

| Function                   | Returns           | TODO                                           |
| -------------------------- | ----------------- | ---------------------------------------------- |
| `getIssues()`              | `DbIssue[]`       | `supabase.from("issues").select("*")`          |
| `getIssueById(id)`         | `DbIssue \| null` | `supabase.from("issues").select().eq("id",id)` |
| `getIssueTimeline(id)`     | `DbIssueUpdate[]` | `supabase.from("issue_updates").select()`      |
| `getIssueAdminUpdates(id)` | `DbIssueUpdate[]` | Same table, filtered by type                   |
| `createIssue(payload)`     | `DbIssue`         | `.insert(payload).select().single()`           |
| `upvoteIssue(id, uid)`     | `DbIssueVote`     | `.insert({ issue_id, user_id })`               |
| `addIssueUpdate(id, u)`    | `DbIssueUpdate`   | `.insert(update).select().single()`            |

---

## 4. UI Wiring Order

Recommended integration sequence (smallest risk first):

| Step | Page / Feature         | Service Call                | Difficulty |
| ---- | ---------------------- | --------------------------- | ---------- |
| 1    | Auth (login/signup)    | Supabase Auth               | Medium     |
| 2    | Middleware guard       | `supabase.auth.getUser()`   | Low        |
| 3    | Issue list page        | `getIssues()`               | Low        |
| 4    | Issue detail page      | `getIssueById()` + timeline | Low        |
| 5    | Report wizard (create) | `createIssue()`             | Medium     |
| 6    | Upvote                 | `upvoteIssue()`             | Low        |
| 7    | Admin updates / chat   | `addIssueUpdate()`          | Medium     |
| 8    | Admin console (users)  | New `users` service         | Medium     |
| 9    | Audit log              | New `audit` service         | Low        |
| 10   | Locations management   | New `locations` service     | Medium     |
| 11   | Faculty analytics      | Aggregate queries           | High       |

---

## 5. Environment Variables

| Variable                        | Scope  | Required |
| ------------------------------- | ------ | -------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Client | Yes      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client | Yes      |
| `SUPABASE_SERVICE_ROLE_KEY`     | Server | Yes      |

Defined in `.env.example`. Access via `src/lib/env.ts` (warns in dev if missing, never crashes).

---

## 6. File Map

| File                         | Purpose                               |
| ---------------------------- | ------------------------------------- |
| `src/types/db.ts`            | DB-aligned TypeScript interfaces      |
| `src/lib/db/index.ts`        | Database client placeholder           |
| `src/lib/api/index.ts`       | ApiResponse type + ok/err helpers     |
| `src/lib/services/issues.ts` | Issue CRUD — mock now, Supabase later |
| `src/lib/services/index.ts`  | Barrel export for service layer       |
| `src/lib/env.ts`             | Safe env var access                   |
| `.env.example`               | Template for required env vars        |

---

_Created during backend-readiness sprint._
