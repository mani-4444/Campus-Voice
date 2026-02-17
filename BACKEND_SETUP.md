# Backend Integration Setup Guide

## Current Status
- ✅ Supabase environment configured
- ✅ Frontend service layer updated to use Supabase
- ✅ Database migrations created
- ⏳ Database tables need to be created

## Quick Setup

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to https://supabase.com and login to your project
2. Navigate to **SQL Editor**
3. Create a new query and run the SQL from:
   - `supabase/migrations/001_profiles.sql` (if not already applied)
   - `supabase/migrations/002_issues.sql` (required for all features)

### Option 2: Using Supabase CLI (if available)

```bash
supabase db push
```

## What Gets Created

The migrations set up:
- **profiles** - User roles and departments
- **issues** - Main issue reports with status tracking
- **issue_updates** - Comments and status changes
- **issue_votes** - Upvotes/support for issues
- **issue_flags** - Content moderation flags
- **locations** - Campus location hierarchy
- **audit_logs** - Admin action tracking

## Testing the Connection

Once tables are created:
1. Navigate to http://localhost:3000/dashboard
2. Try creating a new issue via the Report wizard
3. Check the browser console for any errors
4. Issues should appear in the Issues list

## Troubleshooting

**"No such table: issues"** 
→ Run the `002_issues.sql` migration in Supabase Dashboard

**"Permission denied"**
→ Ensure RLS policies are created (included in migrations)

**"row level security conflict"**
→ Policies already exist; safe to ignore

## Next Steps

- Create sample data for testing
- Set up database backups
- Configure automatic updates for issue_count in locations
- Add search/filtering indexes as needed
