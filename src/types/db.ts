// ──────────────────────────────────────────────
// Database-aligned type definitions
// These mirror the planned Supabase schema and
// will be replaced by generated types once DB is live.
// ──────────────────────────────────────────────

export type UserRole = "student" | "faculty" | "admin";
export type IssueStatus =
  | "submitted"
  | "under_review"
  | "in_progress"
  | "resolved";
export type IssuePriority = "critical" | "high" | "medium" | "low";
export type UpdateType = "system" | "assign" | "update" | "critical";
export type AuditType = "resolve" | "assign" | "escalate" | "update" | "system";
export type LocationType = "campus" | "block" | "lab" | "hostel" | "facility";

/** profiles table */
export interface DbProfile {
  id: string; // uuid FK → auth.users
  role: UserRole;
  dept: string | null;
  created_at: string;
}

/** issues table */
export interface DbIssue {
  id: number;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  category: string;
  location: string;
  reporter_id: string | null; // nullable for anonymous
  assigned_to: string | null;
  upvotes: number;
  progress: number;
  created_at: string;
  updated_at: string;
}

/** issue_updates table */
export interface DbIssueUpdate {
  id: number;
  issue_id: number;
  author: string;
  message: string;
  type: UpdateType;
  created_at: string;
}

/** issue_votes table */
export interface DbIssueVote {
  id: number;
  issue_id: number;
  user_id: string;
  created_at: string;
}

/** issue_flags table */
export interface DbIssueFlag {
  id: number;
  issue_id: number;
  user_id: string;
  reason: string;
  created_at: string;
}

/** locations table */
export interface DbLocation {
  id: string;
  name: string;
  type: LocationType;
  parent_id: string | null;
  issue_count: number;
}

/** audit_logs table */
export interface DbAuditLog {
  id: number;
  action: string;
  admin_id: string;
  type: AuditType;
  created_at: string;
}
