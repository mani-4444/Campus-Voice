// ──────────────────────────────────────────────
// Admin-specific issues service
// Person working on ADMIN dashboard edits this file
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
  console.error(`[Admin][${operation}] DB Error:`, message);
  return message;
}

// ── Admin Queries ────────────────────────────────────

/**
 * Get all issues (admin full access)
 */
export async function getAllIssues(): Promise<ApiResponse<DbIssue[]>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("issues")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) return err(handleDbError(error, "getAllIssues"));
    if (!data) return ok([]);
    
    return ok(data as DbIssue[]);
  } catch (error) {
    return err(handleDbError(error, "getAllIssues"));
  }
}

/**
 * Get issues by status (for admin filtering)
 */
export async function getIssuesByStatus(
  status: string,
): Promise<ApiResponse<DbIssue[]>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("issues")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false });
    
    if (error) return err(handleDbError(error, "getIssuesByStatus"));
    if (!data) return ok([]);
    
    return ok(data as DbIssue[]);
  } catch (error) {
    return err(handleDbError(error, "getIssuesByStatus"));
  }
}

/**
 * Get flagged/escalated issues
 */
export async function getFlaggedIssues(): Promise<ApiResponse<DbIssue[]>> {
  try {
    const supabase = createClient();
    // First get flagged issue IDs
    const { data: flags, error: flagError } = await supabase
      .from("issue_flags")
      .select("issue_id");
    
    if (flagError) return err(handleDbError(flagError, "getFlaggedIssues:flags"));
    if (!flags || flags.length === 0) return ok([]);
    
    const issueIds = flags.map((f: any) => f.issue_id);
    
    // Then get the actual issues
    const { data, error } = await supabase
      .from("issues")
      .select("*")
      .in("id", issueIds);
    
    if (error) return err(handleDbError(error, "getFlaggedIssues:issues"));
    if (!data) return ok([]);
    
    return ok(data as DbIssue[]);
  } catch (error) {
    return err(handleDbError(error, "getFlaggedIssues"));
  }
}

/**
 * Get analytics data for admin dashboard
 */
export async function getIssueAnalytics(): Promise<
  ApiResponse<{
    total: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    byCategory: Record<string, number>;
  }>
> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("issues").select("*");
    
    if (error) return err(handleDbError(error, "getIssueAnalytics"));
    if (!data) {
      return ok({
        total: 0,
        byStatus: {},
        byPriority: {},
        byCategory: {},
      });
    }
    
    const issues = data as DbIssue[];
    
    // Compute analytics
    const byStatus: Record<string, number> = {};
    const byPriority: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    
    issues.forEach((issue) => {
      byStatus[issue.status] = (byStatus[issue.status] || 0) + 1;
      byPriority[issue.priority] = (byPriority[issue.priority] || 0) + 1;
      byCategory[issue.category] = (byCategory[issue.category] || 0) + 1;
    });
    
    return ok({
      total: issues.length,
      byStatus,
      byPriority,
      byCategory,
    });
  } catch (error) {
    return err(handleDbError(error, "getIssueAnalytics"));
  }
}

// ── Admin Mutations ──────────────────────────────────

/**
 * Update any issue (full admin control)
 */
export async function adminUpdateIssue(
  issueId: number,
  updates: Partial<DbIssue>,
): Promise<ApiResponse<DbIssue>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("issues")
      .update(updates)
      .eq("id", issueId)
      .select()
      .single();
    
    if (error) return err(handleDbError(error, "adminUpdateIssue"));
    if (!data) return err("Failed to update issue");
    
    return ok(data as DbIssue);
  } catch (error) {
    return err(handleDbError(error, "adminUpdateIssue"));
  }
}

/**
 * Delete issue (admin only)
 */
export async function deleteIssue(
  issueId: number,
): Promise<ApiResponse<void>> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("issues")
      .delete()
      .eq("id", issueId);
    
    if (error) return err(handleDbError(error, "deleteIssue"));
    
    return ok(undefined);
  } catch (error) {
    return err(handleDbError(error, "deleteIssue"));
  }
}

/**
 * Bulk update issues
 */
export async function bulkUpdateIssues(
  issueIds: number[],
  updates: Partial<DbIssue>,
): Promise<ApiResponse<DbIssue[]>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("issues")
      .update(updates)
      .in("id", issueIds)
      .select();
    
    if (error) return err(handleDbError(error, "bulkUpdateIssues"));
    if (!data) return ok([]);
    
    return ok(data as DbIssue[]);
  } catch (error) {
    return err(handleDbError(error, "bulkUpdateIssues"));
  }
}

/**
 * Add admin note to issue
 */
export async function addAdminNote(
  issueId: number,
  authorName: string,
  message: string,
): Promise<ApiResponse<DbIssueUpdate>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("issue_updates")
      .insert([
        {
          issue_id: issueId,
          author: authorName,
          message,
          type: "admin_note",
        },
      ])
      .select()
      .single();
    
    if (error) return err(handleDbError(error, "addAdminNote"));
    if (!data) return err("Failed to create admin note");
    
    return ok(data as DbIssueUpdate);
  } catch (error) {
    return err(handleDbError(error, "addAdminNote"));
  }
}

// ── ADD YOUR ADMIN-SPECIFIC FUNCTIONS BELOW ──────────
// Person working on admin dashboard: add new functions here
// This prevents conflicts with student/faculty developers
