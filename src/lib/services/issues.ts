// ──────────────────────────────────────────────
// Issues service layer
// Currently returns mock data. Each function is
// typed to match the DB schema so swapping to real
// Supabase queries is a drop-in replacement.
// ──────────────────────────────────────────────

import type { DbIssue, DbIssueUpdate, DbIssueVote } from "@/types/db";
import type { ApiResponse } from "@/lib/api";
import { ok, err } from "@/lib/api";
import { issues, getTimelineForIssue, getUpdatesForIssue } from "@/lib/mock";

// ── Queries ──────────────────────────────────

export async function getIssues(): Promise<ApiResponse<DbIssue[]>> {
  // TODO: replace with supabase.from("issues").select("*")
  const mapped: DbIssue[] = issues.map((i) => ({
    id: i.id,
    title: i.title,
    description: i.description,
    status: i.status.replace(" ", "_") as DbIssue["status"],
    priority: i.priority as DbIssue["priority"],
    category: i.category,
    location: i.location,
    reporter_id: null,
    assigned_to: null,
    upvotes: i.upvotes,
    progress: i.progress,
    created_at: i.date,
    updated_at: i.date,
  }));
  return ok(mapped);
}

export async function getIssueById(
  issueId: number,
): Promise<ApiResponse<DbIssue | null>> {
  const issue = issues.find((i) => i.id === issueId);
  if (!issue) return err("Issue not found");

  const mapped: DbIssue = {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    status: issue.status.replace(" ", "_") as DbIssue["status"],
    priority: issue.priority as DbIssue["priority"],
    category: issue.category,
    location: issue.location,
    reporter_id: null,
    assigned_to: null,
    upvotes: issue.upvotes,
    progress: issue.progress,
    created_at: issue.date,
    updated_at: issue.date,
  };
  return ok(mapped);
}

export async function getIssueTimeline(
  issueId: number,
): Promise<ApiResponse<DbIssueUpdate[]>> {
  // TODO: replace with supabase query
  const steps = getTimelineForIssue(issueId);
  const mapped: DbIssueUpdate[] = steps.map((s, idx) => ({
    id: idx + 1,
    issue_id: issueId,
    author: s.label,
    message: s.description,
    type: "system" as DbIssueUpdate["type"],
    created_at: s.date,
  }));
  return ok(mapped);
}

export async function getIssueAdminUpdates(
  issueId: number,
): Promise<ApiResponse<DbIssueUpdate[]>> {
  const updates = getUpdatesForIssue(issueId);
  const mapped: DbIssueUpdate[] = updates.map((u) => ({
    id: u.id ?? 0,
    issue_id: u.issueId ?? issueId,
    author: u.author,
    message: u.message,
    type: "update",
    created_at: u.time,
  }));
  return ok(mapped);
}

// ── Mutations ────────────────────────────────

export async function createIssue(
  _payload: Partial<DbIssue>,
): Promise<ApiResponse<DbIssue>> {
  // TODO: replace with supabase.from("issues").insert(payload)
  return err("Not implemented — backend not connected");
}

export async function upvoteIssue(
  _issueId: number,
  _userId: string,
): Promise<ApiResponse<DbIssueVote>> {
  // TODO: replace with supabase.from("issue_votes").insert(...)
  return err("Not implemented — backend not connected");
}

export async function addIssueUpdate(
  _issueId: number,
  _update: Partial<DbIssueUpdate>,
): Promise<ApiResponse<DbIssueUpdate>> {
  // TODO: replace with supabase.from("issue_updates").insert(...)
  return err("Not implemented — backend not connected");
}
