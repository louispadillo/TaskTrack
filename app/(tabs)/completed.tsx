// ============================================================================
// app/(tabs)/completed.tsx → COMPLETED: the tasks already ticked off
// ============================================================================
// Tapping a row here unticks it, which sends it back to Home.
// ----------------------------------------------------------------------------

import TaskListScreen from "../../components/TaskListScreen";

export default function CompletedScreen() {
  return (
    <TaskListScreen
      completed
      title={() => "Completed tasks"}
      empty="Nothing completed yet."
    />
  );
}
