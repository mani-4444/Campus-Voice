// ──────────────────────────────────────────────
// Issues service layer - Connected to Supabase
// Backend integration guide: see BACKEND_SETUP.md
// ──────────────────────────────────────────────

import type { DbIssue, DbIssueUpdate, DbIssueVote } from "@/types/db";
import type { ApiResponse } from "@/lib/api";
import { ok, err } from "@/lib/api";
import { createClient } from "@/lib/supabase/client";

const debugApiErrors = true; // Set to false in production

// Helper to provide user-friendly errors
function handleDbError(error: unknown, operation: string): string {
  const message = (error as Error)?.message || String(error) || "Unknown error";

  if (message.includes("relation") || message.includes("does not exist")) {
    return `Database tables not initialized. See BACKEND_SETUP.md for setup instructions.`;
  }
  if (message.includes("permission denied") || message.includes("policy")) {
    return `Access denied. Check RLS policies in Supabase.`;
  }
  if (debugApiErrors) {
    console.error(`[${operation}] DB Error:`, message);
  }
  return message;
}

// ── Queries ──────────────────────────────────

export async function getIssues(): Promise<ApiResponse<DbIssue[]>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("issues").select("*");

    if (error) return err(handleDbError(error, "getIssues"));
    if (!data) return ok([]);

    return ok(data as DbIssue[]);
  } catch (error) {
    return err(handleDbError(error, "getIssues"));
  }
}

export async function getIssueById(
  issueId: string,
): Promise<ApiResponse<DbIssue | null>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("issues")
      .select("*")
      .eq("id", issueId)
      .single();

    if (error) {
      if (error.code === "PGRST116") return ok(null); // Not found
      return err(handleDbError(error, "getIssueById"));
    }

    return ok(data as DbIssue);
  } catch (error) {
    return err(handleDbError(error, "getIssueById"));
  }
}

export async function getIssueTimeline(
  issueId: string,
): Promise<ApiResponse<DbIssueUpdate[]>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("issue_updates")
      .select("*")
      .eq("issue_id", issueId)
      .eq("update_type", "system")
      .order("created_at", { ascending: true });

    if (error) return err(handleDbError(error, "getIssueTimeline"));
    if (!data) return ok([]);

    return ok(data as DbIssueUpdate[]);
  } catch (error) {
    return err(handleDbError(error, "getIssueTimeline"));
  }
}

export async function getIssueAdminUpdates(
  issueId: string,
): Promise<ApiResponse<DbIssueUpdate[]>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("issue_updates")
      .select("*")
      .eq("issue_id", issueId)
      .neq("update_type", "system")
      .order("created_at", { ascending: false });

    if (error) return err(handleDbError(error, "getIssueAdminUpdates"));
    if (!data) return ok([]);

    return ok(data as DbIssueUpdate[]);
  } catch (error) {
    return err(handleDbError(error, "getIssueAdminUpdates"));
  }
}

// ── Mutations ────────────────────────────────

export async function createIssue(
  payload: Partial<DbIssue>,
): Promise<ApiResponse<DbIssue>> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return err("You must be logged in to create an issue");

    const { data, error } = await supabase
      .from("issues")
      .insert([
        {
          title: payload.title ?? "Untitled",
          description: payload.description ?? "",
          status: payload.status ?? "submitted",
          priority: payload.priority ?? "medium",
          category: payload.category ?? "Other",
          location: payload.location ?? "Unknown",
          visibility: payload.visibility ?? "student",
          created_by: user.id,
        },
      ])
      .select()
      .single();

    if (error) return err(handleDbError(error, "createIssue"));
    if (!data) return err("Failed to create issue");

    return ok(data as DbIssue);
  } catch (error) {
    return err(handleDbError(error, "createIssue"));
  }
}

export async function upvoteIssue(
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

    if (fetchError) return err(handleDbError(fetchError, "upvoteIssue:check"));

    // If already voted, remove the vote (using composite PK)
    if (existing) {
      const { error: deleteError } = await supabase
        .from("issue_votes")
        .delete()
        .eq("issue_id", issueId)
        .eq("user_id", userId);

      if (deleteError)
        return err(handleDbError(deleteError, "upvoteIssue:delete"));
      return ok(existing as DbIssueVote);
    }

    // Otherwise, add new vote
    const { data, error } = await supabase
      .from("issue_votes")
      .insert([{ issue_id: issueId, user_id: userId }])
      .select()
      .single();

    if (error) return err(handleDbError(error, "upvoteIssue:insert"));
    if (!data) return err("Failed to create vote");

    return ok(data as DbIssueVote);
  } catch (error) {
    return err(handleDbError(error, "upvoteIssue"));
  }
}

export async function toggleUpvote(
  issueId: string,
  userId: string,
): Promise<ApiResponse<DbIssueVote>> {
  return upvoteIssue(issueId, userId);
}

export async function addIssueUpdate(
  issueId: string,
  update: Partial<DbIssueUpdate>,
): Promise<ApiResponse<DbIssueUpdate>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("issue_updates")
      .insert([
        {
          issue_id: issueId,
          created_by: update.created_by ?? null,
          message: update.message ?? "",
          update_type: update.update_type ?? "update",
        },
      ])
      .select()
      .single();

    if (error) return err(handleDbError(error, "addIssueUpdate"));
    if (!data) return err("Failed to create update");

    return ok(data as DbIssueUpdate);
  } catch (error) {
    return err(handleDbError(error, "addIssueUpdate"));
  }
}
