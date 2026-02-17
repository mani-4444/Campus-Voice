// ──────────────────────────────────────────────
// Database-aligned type definitions
// These mirror the Supabase schema defined in
// supabase/migrations/001_profiles.sql and 002_issues.sql
// ──────────────────────────────────────────────

export type UserRole = "student" | "faculty" | "admin";
export type IssueStatus =
  | "submitted"
  | "under_review"
  | "in_progress"
  | "resolved"
  | "rejected";
export type IssuePriority = "critical" | "high" | "medium" | "low";
export type IssueVisibility = "student" | "faculty" | "public";
export type UpdateType =
  | "system"
  | "assign"
  | "comment"
  | "update"
  | "critical";
export type AuditType = "resolve" | "assign" | "escalate" | "update" | "system";
export type LocationType = "campus" | "block" | "lab" | "hostel" | "facility";
export type ProfileStatus = "active" | "suspended";

/** profiles table */
export interface DbProfile {
  id: string; // uuid FK → auth.users
  role: UserRole;
  name: string | null;
  email: string | null;
  dept: string | null;
  status: ProfileStatus;
  created_at: string;
}

/** issues table */
export interface DbIssue {
  id: string; // uuid
  title: string;
  description: string;
  category: string;
  location: string;
  priority: IssuePriority;
  status: IssueStatus;
  visibility: IssueVisibility;
  created_by: string; // uuid FK → auth.users
  assigned_to: string | null; // uuid FK → auth.users
  upvotes: number; // denormalized count maintained by trigger
  created_at: string;
  updated_at: string;
}

/** issue_updates table */
export interface DbIssueUpdate {
  id: string; // uuid
  issue_id: string; // uuid
  message: string;
  update_type: UpdateType;
  new_status: IssueStatus | null;
  created_by: string | null; // uuid FK → auth.users
  created_at: string;
}

/** issue_votes table (composite PK: issue_id + user_id) */
export interface DbIssueVote {
  issue_id: string; // uuid
  user_id: string; // uuid
  created_at: string;
}

/** issue_flags table */
export interface DbIssueFlag {
  id: string; // uuid
  issue_id: string; // uuid
  flagged_by: string; // uuid FK → auth.users
  reason: string;
  created_at: string;
}

/** locations table */
export interface DbLocation {
  id: string; // uuid
  name: string;
  type: LocationType;
  parent_id: string | null;
  created_at: string;
}

/** audit_logs table */
export interface DbAuditLog {
  id: string; // uuid
  action: string;
  admin_id: string; // uuid FK → auth.users
  type: AuditType;
  details: Record<string, unknown> | null;
  created_at: string;
}
