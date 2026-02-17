// ──────────────────────────────────────────────
// Student-specific issues service
// Person working on STUDENT dashboard edits this file
// ──────────────────────────────────────────────

import type { DbIssue, DbIssueUpdate, DbIssueVote } from "@/types/db";
import type { ApiResponse } from "@/lib/api";
import { ok, err } from "@/lib/api";
import { createClient } from "@/lib/supabase/client";

// Helper to provide user-friendly errors
function handleDbError(error: any, operation: string): string {
  const message = error?.message || error?.toString() || "Unknown error";

  if (message.includes("relation") || message.includes("does not exist")) {
    return `Database tables not initialized. See BACKEND_SETUP.md for setup instructions.`;
  }
  if (message.includes("permission denied") || message.includes("policy")) {
    return `Access denied. Check RLS policies in Supabase.`;
  }
  console.error(`[Student][${operation}] DB Error:`, message);
  return message;
}

// ── Student Queries ──────────────────────────────────

/**
 * Get all issues visible to students (public issues)
 */
export async function getStudentIssues(): Promise<ApiResponse<DbIssue[]>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("issues")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return err(handleDbError(error, "getStudentIssues"));
    if (!data) return ok([]);

    return ok(data as DbIssue[]);
  } catch (error) {
    return err(handleDbError(error, "getStudentIssues"));
  }
}

/**
 * Get issues reported by specific student
 */
export async function getMyReportedIssues(
  userId: string,
): Promise<ApiResponse<DbIssue[]>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("issues")
      .select("*")
      .eq("created_by", userId)
      .order("created_at", { ascending: false });

    if (error) return err(handleDbError(error, "getMyReportedIssues"));
    if (!data) return ok([]);

    return ok(data as DbIssue[]);
  } catch (error) {
    return err(handleDbError(error, "getMyReportedIssues"));
  }
}

/**
 * Get issues upvoted by student
 */
export async function getMyUpvotedIssues(
  userId: string,
): Promise<ApiResponse<DbIssue[]>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("issue_votes")
      .select("issue_id, issues(*)")
      .eq("user_id", userId);

    if (error) return err(handleDbError(error, "getMyUpvotedIssues"));
    if (!data) return ok([]);

    // Extract issues from join
    const issues = data
      .map((vote: any) => vote.issues)
      .filter((issue: any) => issue !== null) as DbIssue[];

    return ok(issues);
  } catch (error) {
    return err(handleDbError(error, "getMyUpvotedIssues"));
  }
}

// ── Student Mutations ────────────────────────────────

/**
 * Report a new issue (student submission)
 */
export async function reportIssue(
  payload: Partial<DbIssue>,
): Promise<ApiResponse<DbIssue>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("issues")
      .insert([
        {
          title: payload.title ?? "Untitled",
          description: payload.description ?? "",
          status: "submitted",
          priority: payload.priority ?? "medium",
          category: payload.category ?? "Other",
          location: payload.location ?? "Unknown",
          created_by: payload.created_by,
          visibility: payload.visibility ?? "student",
        },
      ])
      .select()
      .single();

    if (error) return err(handleDbError(error, "reportIssue"));
    if (!data) return err("Failed to create issue");

    return ok(data as DbIssue);
  } catch (error) {
    return err(handleDbError(error, "reportIssue"));
  }
}

/**
 * Toggle upvote on an issue
 */
export async function toggleStudentUpvote(
  issueId: string,
  userId: string,
): Promise<ApiResponse<DbIssueVote>> {
  try {
    const supabase = createClient();

    // Check if vote already exists
    const { data: existing, error: fetchError } = await supabase
      .from("issue_votes")
      .select("*")
      .eq("issue_id", issueId)
      .eq("user_id", userId)
      .maybeSingle();

    if (fetchError) return err(handleDbError(fetchError, "toggleUpvote:check"));

    // If already voted, remove the vote (composite PK: issue_id + user_id)
    if (existing) {
      const { error: deleteError } = await supabase
        .from("issue_votes")
        .delete()
        .eq("issue_id", issueId)
        .eq("user_id", userId);

      if (deleteError)
        return err(handleDbError(deleteError, "toggleUpvote:delete"));
      return ok(existing as DbIssueVote);
    }

    // Otherwise, add new vote
    const { data, error } = await supabase
      .from("issue_votes")
      .insert([{ issue_id: issueId, user_id: userId }])
      .select()
      .single();

    if (error) return err(handleDbError(error, "toggleUpvote:insert"));
    if (!data) return err("Failed to create vote");

    return ok(data as DbIssueVote);
  } catch (error) {
    return err(handleDbError(error, "toggleUpvote"));
  }
}

// ── ADD YOUR STUDENT-SPECIFIC FUNCTIONS BELOW ────────
// Person working on student dashboard: add new functions here
// This prevents conflicts with faculty/admin developers
