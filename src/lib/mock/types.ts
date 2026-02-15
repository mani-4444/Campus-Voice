// ──────────────────────────────────────────────
// Shared types used across mock data & UI
// These will eventually map to Supabase/DB types
// ──────────────────────────────────────────────

export type IssueStatus =
  | "Submitted"
  | "Under Review"
  | "In Progress"
  | "Resolved";
export type IssuePriority = "Critical" | "High" | "Medium" | "Low";
export type IssueCategory =
  | "Infrastructure"
  | "IT Services"
  | "Academics"
  | "Facilities"
  | "Safety"
  | "Administration"
  | "Hostel"
  | "Transportation";
export type ReporterRole = "student" | "faculty";

export interface Issue {
  id: number;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  category: IssueCategory;
  location: string;
  date: string;
  upvotes: number;
  progress: number;
  reporter: ReporterRole;
  assigned: string;
}

export interface TimelineStep {
  label: string;
  date: string;
  completed: boolean;
  current: boolean;
  description: string;
}

export interface AdminUpdate {
  id?: number;
  issueId?: number;
  author: string;
  message: string;
  time: string;
  type: "system" | "assign" | "update" | "critical";
}

/** Maps to `issue_votes` table */
export interface IssueVote {
  id: number;
  issueId: number;
  userId: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: number;
  action: string;
  admin: string;
  time: string;
  type: "resolve" | "assign" | "escalate" | "update" | "system";
}

export interface MockUser {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Faculty" | "Student";
  dept: string;
  status: "Active" | "Suspended";
}

export interface LocationNode {
  id: string;
  name: string;
  type: "campus" | "block" | "lab" | "hostel" | "facility";
  children?: LocationNode[];
  issueCount?: number;
}

export interface ActionItem {
  id: number;
  title: string;
  priority: "Critical" | "High" | "Medium";
  deadline: string;
  type: string;
}

export interface DepartmentDataPoint {
  dept: string;
  issues: number;
}

export interface SentimentDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface ChartDataPoint {
  month: string;
  issues: number;
}

export interface RecentActivity {
  text: string;
  time: string;
  type: string;
}
