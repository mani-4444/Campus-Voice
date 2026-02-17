// ──────────────────────────────────────────────
// Faculty-specific issues service
// Person working on FACULTY dashboard edits this file
// ──────────────────────────────────────────────

import type { DbIssue, DbIssueUpdate } from "@/types/db";
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
  console.error(`[Faculty][${operation}] DB Error:`, message);
  return message;
}

// ── Faculty Queries ──────────────────────────────────

/**
 * Get issues assigned to faculty member
 */
export async function getAssignedIssues(
  facultyId: string,
): Promise<ApiResponse<DbIssue[]>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("issues")
      .select("*")
      .eq("assigned_to", facultyId)
      .order("created_at", { ascending: false });

    if (error) return err(handleDbError(error, "getAssignedIssues"));
    if (!data) return ok([]);

    return ok(data as DbIssue[]);
  } catch (error) {
    return err(handleDbError(error, "getAssignedIssues"));
  }
}

/**
 * Get issues by department
 */
export async function getIssuesByDepartment(
  department: string,
): Promise<ApiResponse<DbIssue[]>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("issues")
      .select("*")
      .eq("category", department)
      .order("created_at", { ascending: false });

    if (error) return err(handleDbError(error, "getIssuesByDepartment"));
    if (!data) return ok([]);

    return ok(data as DbIssue[]);
  } catch (error) {
    return err(handleDbError(error, "getIssuesByDepartment"));
  }
}

/**
 * Get high-priority issues requiring attention
 */
export async function getHighPriorityIssues(): Promise<ApiResponse<DbIssue[]>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("issues")
      .select("*")
      .in("priority", ["high", "critical"])
      .in("status", ["submitted", "in_progress"])
      .order("priority", { ascending: false });

    if (error) return err(handleDbError(error, "getHighPriorityIssues"));
    if (!data) return ok([]);

    return ok(data as DbIssue[]);
  } catch (error) {
    return err(handleDbError(error, "getHighPriorityIssues"));
  }
}

// ── Faculty Mutations ────────────────────────────────

/**
 * Add faculty update/comment to issue
 */
export async function addFacultyUpdate(
  issueId: string,
  userId: string,
  message: string,
  type: "update" | "comment" | "system" = "update",
): Promise<ApiResponse<DbIssueUpdate>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("issue_updates")
      .insert([
        {
          issue_id: issueId,
          created_by: userId,
          message,
          update_type: type,
        },
      ])
      .select()
      .single();

    if (error) return err(handleDbError(error, "addFacultyUpdate"));
    if (!data) return err("Failed to create update");

    return ok(data as DbIssueUpdate);
  } catch (error) {
    return err(handleDbError(error, "addFacultyUpdate"));
  }
}

/**
 * Update issue status (faculty action)
 */
export async function updateIssueStatus(
  issueId: string,
  status: string,
): Promise<ApiResponse<DbIssue>> {
  try {
    const supabase = createClient();
    const updatePayload: any = { status };

    const { data, error } = await supabase
      .from("issues")
      .update(updatePayload)
      .eq("id", issueId)
      .select()
      .single();

    if (error) return err(handleDbError(error, "updateIssueStatus"));
    if (!data) return err("Failed to update issue");

    return ok(data as DbIssue);
  } catch (error) {
    return err(handleDbError(error, "updateIssueStatus"));
  }
}

/**
 * Assign issue to faculty member
 */
export async function assignIssue(
  issueId: string,
  facultyId: string,
): Promise<ApiResponse<DbIssue>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("issues")
      .update({ assigned_to: facultyId })
      .eq("id", issueId)
      .select()
      .single();

    if (error) return err(handleDbError(error, "assignIssue"));
    if (!data) return err("Failed to assign issue");

    return ok(data as DbIssue);
  } catch (error) {
    return err(handleDbError(error, "assignIssue"));
  }
}

// ── ADD YOUR FACULTY-SPECIFIC FUNCTIONS BELOW ────────
// Person working on faculty dashboard: add new functions here
// This prevents conflicts with student/admin developers
