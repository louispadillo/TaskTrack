// ============================================================================
// lib/tasks.ts → everything the app does with the tasks table
// ============================================================================
// Note what is NOT here: any mention of which user owns a task. We never filter
// by user and we never send a user id. The database does both for us — the
// row-level security policies in supabase/schema.sql restrict every query to
// the signed-in user, and user_id defaults to auth.uid() on insert.
//
// That is deliberate. A filter written here could be forgotten; a policy
// written there cannot be bypassed.
// ----------------------------------------------------------------------------

import { supabase } from "./supabase";

export type Task = {
  id: string;
  title: string;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
};

const COLUMNS = "id, title, is_completed, completed_at, created_at";

/** Home passes false, Completed passes true. */
export async function fetchTasks(isCompleted: boolean): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select(COLUMNS)
    .eq("is_completed", isCompleted)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createTask(title: string): Promise<void> {
  // user_id is left out on purpose — the column defaults to auth.uid().
  const { error } = await supabase.from("tasks").insert({ title: title.trim() });
  if (error) throw error;
}

export async function setTaskCompleted(id: string, isCompleted: boolean): Promise<void> {
  // completed_at is left out on purpose — the database trigger maintains it.
  const { error } = await supabase
    .from("tasks")
    .update({ is_completed: isCompleted })
    .eq("id", id);

  if (error) throw error;
}
