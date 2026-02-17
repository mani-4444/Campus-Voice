# 🚀 Team Workflow Guide - Parallel Development

This guide helps 3 developers work on Student, Faculty, and Admin features simultaneously **without merge conflicts**.

## 📋 Quick Start

### Person 1: Student Dashboard

```bash
git checkout main
git pull origin main
git checkout -b feat/student-dashboard
git push -u origin feat/student-dashboard
```

**Your files (safe to edit):**
- ✅ `src/app/(dashboard)/dashboard/page.tsx` - Student dashboard UI
- ✅ `src/lib/services/student-issues.ts` - Student backend logic
- ✅ `supabase/migrations/003_student_*.sql` - Student-specific DB changes (create new file)

**Avoid editing:**
- ❌ `src/lib/services/issues.ts` (shared)
- ❌ `src/lib/services/faculty-issues.ts`
- ❌ `src/lib/services/admin-issues.ts`
- ❌ `src/components/app-context.tsx` (coordinate if needed)

---

### Person 2: Faculty Dashboard

```bash
git checkout main
git pull origin main
git checkout -b feat/faculty-dashboard
git push -u origin feat/faculty-dashboard
```

**Your files (safe to edit):**
- ✅ `src/app/(dashboard)/faculty/page.tsx` - Faculty dashboard UI
- ✅ `src/lib/services/faculty-issues.ts` - Faculty backend logic
- ✅ `supabase/migrations/004_faculty_*.sql` - Faculty-specific DB changes (create new file)
- ✅ `src/components/faculty-action-items.tsx` - Faculty-specific component

**Avoid editing:**
- ❌ `src/lib/services/issues.ts` (shared)
- ❌ `src/lib/services/student-issues.ts`
- ❌ `src/lib/services/admin-issues.ts`
- ❌ `src/components/app-context.tsx` (coordinate if needed)

---

### Person 3: Admin Dashboard

```bash
git checkout main
git pull origin main
git checkout -b feat/admin-dashboard
git push -u origin feat/admin-dashboard
```

**Your files (safe to edit):**
- ✅ `src/app/(dashboard)/admin/page.tsx` - Admin dashboard UI
- ✅ `src/lib/services/admin-issues.ts` - Admin backend logic
- ✅ `supabase/migrations/005_admin_*.sql` - Admin-specific DB changes (create new file)
- ✅ `src/components/user-management-table.tsx` - Admin user management
- ✅ `src/components/audit-log.tsx` - Admin audit log

**Avoid editing:**
- ❌ `src/lib/services/issues.ts` (shared)
- ❌ `src/lib/services/student-issues.ts`
- ❌ `src/lib/services/faculty-issues.ts`
- ❌ `src/components/app-context.tsx` (coordinate if needed)

---

## 🎯 How to Avoid Conflicts

### 1. **File Ownership**
Each person owns their service file:
- `student-issues.ts` → Person 1
- `faculty-issues.ts` → Person 2
- `admin-issues.ts` → Person 3

### 2. **Shared Files Strategy**

If you need to edit shared files:

**Option A: Communicate First**
```
Team chat: "I'm adding getIssuesByLocation() to issues.ts"
```

**Option B: Only Append (Don't Modify)**
- Add new functions at the end of `issues.ts`
- Don't modify existing functions
- Import and use in your role-specific file

**Example:**
```typescript
// In issues.ts (append only)
export async function getIssuesByLocation(location: string) {
  // shared implementation
}

// In student-issues.ts (use it)
import { getIssuesByLocation } from "./issues";
export async function getStudentLocationIssues(location: string) {
  return getIssuesByLocation(location);
}
```

### 3. **Database Migrations**

Use **separate numbered files**:
- Person 1: `003_student_features.sql`
- Person 2: `004_faculty_features.sql`
- Person 3: `005_admin_features.sql`

⚠️ **Don't edit** `002_issues.sql` - it's the base migration

### 4. **Components**

**Shared components** (coordinate before editing):
- `app-context.tsx` - Global state
- `app-navbar.tsx` - Navigation
- `app-sidebar.tsx` - Sidebar

**Role-specific components** (safe to edit):
- `faculty-action-items.tsx` → Person 2
- `user-management-table.tsx` → Person 3
- `audit-log.tsx` → Person 3

---

## 🔄 Daily Workflow

```bash
# Start of day
git checkout your-branch
git fetch origin
git rebase origin/main  # Stay up to date

# During work
git add .
git commit -m "feat(student): add upvote tracking"
git push origin your-branch

# End of day
git push origin your-branch  # Ensure backup
```

---

## 🎉 Merging Strategy

### Order Matters!

Merge in sequence for easier debugging:

**1. Student → Main** (Person 1)
```bash
# Create Pull Request on GitHub
# After approval and tests pass:
git checkout main
git pull origin main
git merge feat/student-dashboard
git push origin main
```

**2. Faculty → Main** (Person 2)
```bash
# Wait for Student branch to merge
# Then create Pull Request
# After approval:
git checkout main
git pull origin main
git merge feat/faculty-dashboard
git push origin main
```

**3. Admin → Main** (Person 3)
```bash
# Wait for Faculty branch to merge
# Then create Pull Request
# After approval:
git checkout main
git pull origin main
git merge feat/admin-dashboard
git push origin main
```

### Why Sequential?
- If conflicts occur, you know exactly which merge caused it
- Earlier merges are tested before later ones
- Easier to resolve issues incrementally

---

## 🆘 If You Get a Conflict

### Scenario: Both edited `issues.ts`

```bash
git checkout your-branch
git pull origin main

# If conflict in issues.ts:
# 1. Open the file
# 2. Look for conflict markers:
#    <<<<<<< HEAD
#    your changes
#    =======
#    their changes
#    >>>>>>> main

# 3. Keep BOTH functions (append, don't replace)
# 4. Remove conflict markers
# 5. Test the code

git add src/lib/services/issues.ts
git commit -m "merge: resolve issues.ts conflict"
git push origin your-branch
```

---

## 💡 Best Practices

### ✅ DO:
- Push frequently (at least once per day)
- Write clear commit messages: `feat(student): add upvote feature`
- Test your code before pushing
- Add your new functions at the END of service files
- Communicate when touching shared files
- Pull from `main` daily to stay in sync

### ❌ DON'T:
- Edit other roles' service files
- Modify existing functions in shared files
- Work directly on `main` branch
- Push broken code
- Merge without testing

---

## 📞 Communication Template

Use this in your team chat:

```
🚧 Working on: [brief description]
📁 Files I'm editing:
  - src/app/(dashboard)/dashboard/page.tsx
  - src/lib/services/student-issues.ts
⚠️  Need to touch shared file: issues.ts (adding getIssuesByTag function)
✅ Status: [In Progress / Ready for Review / Merged]
```

---

## 🎨 Architecture Overview

```
┌─────────────────────────────────────────┐
│  Student Dashboard (Person 1)          │
│  ├── dashboard/page.tsx                │
│  └── student-issues.ts                 │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  Shared Service (All 3)                │
│  issues.ts (coordinate before editing) │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  Faculty Dashboard (Person 2)          │
│  ├── faculty/page.tsx                  │
│  └── faculty-issues.ts                 │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  Admin Dashboard (Person 3)            │
│  ├── admin/page.tsx                    │
│  └── admin-issues.ts                   │
└─────────────────────────────────────────┘
```

---

## 🔍 Quick Reference

| Developer | Branch | Page File | Service File | Migration File |
|-----------|--------|-----------|--------------|----------------|
| Person 1  | `feat/student-dashboard` | `dashboard/page.tsx` | `student-issues.ts` | `003_student_*.sql` |
| Person 2  | `feat/faculty-dashboard` | `faculty/page.tsx` | `faculty-issues.ts` | `004_faculty_*.sql` |
| Person 3  | `feat/admin-dashboard` | `admin/page.tsx` | `admin-issues.ts` | `005_admin_*.sql` |

---

## ✨ Success Checklist

Before creating a Pull Request:

- [ ] All code runs without errors (`bun run dev`)
- [ ] No TypeScript errors (`bun run build`)
- [ ] Your service file has clear function names
- [ ] Database migrations run successfully
- [ ] Code is formatted and linted
- [ ] Commit messages are descriptive
- [ ] No conflicts with `main` branch
- [ ] Added comments to complex logic

---

**Questions?** Check with your team or refer to this guide!

Good luck! 🚀
