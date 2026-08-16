// ============================================================================
// hooks/useTasks.ts → loading a list of tasks, and keeping it fresh
// ============================================================================
// Home and Completed are the same screen with a different filter, so they share
// this. It reloads whenever the screen comes back into focus, which is what
// makes a task added on the Add tab appear on Home without a manual refresh.
// ----------------------------------------------------------------------------

import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { fetchTasks, setTaskCompleted, type Task } from "../lib/tasks";

export function useTasks(isCompleted: boolean) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      setTasks(await fetchTasks(isCompleted));
    } catch {
      setError("Could not load your tasks. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [isCompleted]);

  // Runs on first render and again every time the tab is returned to.
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  /**
   * Ticking a task moves it off this list and onto the other one, so we drop it
   * straight away rather than waiting for the round trip — the tap feels
   * instant. If the write fails we put it back and say why.
   */
  const toggle = useCallback(
    async (task: Task) => {
      const previous = tasks;
      setTasks((current) => current.filter((t) => t.id !== task.id));

      try {
        await setTaskCompleted(task.id, !task.is_completed);
      } catch {
        setTasks(previous);
        setError("Could not update that task. Check your connection and try again.");
      }
    },
    [tasks]
  );

  return { tasks, loading, error, reload: load, toggle };
}
