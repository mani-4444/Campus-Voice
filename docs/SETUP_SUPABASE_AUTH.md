# Supabase Auth Setup Guide

> Follow these steps to get authentication working locally.

---

## 1. Prerequisites

- A Supabase project (free tier is fine)
- Node.js 18+
- The project cloned and `npm install` run

---

## 2. Environment Variables

Copy the example file:

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

You can find these in your Supabase Dashboard → Settings → API.

---

## 3. Run the Database Migration

Open the **Supabase SQL Editor** (Dashboard → SQL Editor) and paste the contents of:

```
supabase/migrations/001_profiles.sql
```

This creates:

| Object                         | Purpose                                                   |
| ------------------------------ | --------------------------------------------------------- |
| `profiles` table               | Stores user role and department                           |
| `handle_new_user()` function   | Auto-creates a profile row on signup                      |
| `on_auth_user_created` trigger | Fires the function after `auth.users` insert              |
| 3 RLS policies                 | Users read own profile, admins read all, users update own |

Click **Run** to execute.

---

## 4. Disable Email Confirmation (Development)

For local development, disable email confirmation so sign-up works instantly:

1. Go to **Authentication → Providers → Email** in the Supabase Dashboard
2. **Uncheck** "Confirm email"
3. Save

> In production, re-enable this and add an email confirmation flow.

---

## 5. Verify It Works

```bash
npm run dev
```

1. Visit `http://localhost:3000/login`
2. Click **Sign Up** and enter an email + password (min 6 chars)
3. You should be redirected to `/dashboard`
4. Click the profile dropdown (top-right) → **Log Out**
5. You should be redirected to `/login`
6. Visiting `/dashboard` directly without signing in should redirect to `/login`

---

## 6. Assigning Roles

New users are always created with the `student` role. To change a user's role:

```sql
-- In the Supabase SQL Editor:
UPDATE public.profiles
SET role = 'admin'     -- or 'faculty'
WHERE id = '<user-uuid>';
```

You can find user UUIDs in **Authentication → Users** in the Supabase Dashboard.

---

## 7. Architecture

| File                                   | Purpose                                                       |
| -------------------------------------- | ------------------------------------------------------------- |
| `src/lib/supabase/client.ts`           | Singleton browser client (Client Components)                  |
| `src/lib/supabase/server.ts`           | Per-request server client (Server Components, Route Handlers) |
| `src/lib/supabase/middleware.ts`       | Session refresh + route protection logic                      |
| `src/middleware.ts`                    | Next.js middleware entry point                                |
| `src/components/app-context.tsx`       | `AppProvider` — fetches user + profile, exposes `signOut()`   |
| `src/app/login/page.tsx`               | Sign in / sign up with Supabase Auth                          |
| `supabase/migrations/001_profiles.sql` | Database migration for profiles table                         |

---

## 8. Troubleshooting

| Problem                                           | Solution                                                       |
| ------------------------------------------------- | -------------------------------------------------------------- |
| "Invalid API key" on login                        | Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`          |
| Sign up works but profile not created             | Re-run `001_profiles.sql` — the trigger may not exist          |
| Middleware redirect loop                          | Clear cookies, restart dev server                              |
| Role always shows "student" after login           | Check that `profiles` table has data: `SELECT * FROM profiles` |
| Build fails with "Parameter implicitly has 'any'" | Ensure `@supabase/supabase-js` is installed                    |
