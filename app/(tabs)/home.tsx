// ============================================================================
// app/(tabs)/home.tsx → HOME: the tasks still to do
// ============================================================================

import TaskListScreen from "../../components/TaskListScreen";

export default function HomeScreen() {
  return (
    <TaskListScreen
      completed={false}
      title={(count) => `${count} ${count === 1 ? "Task" : "Tasks"} for today`}
      empty="Nothing to do yet. Tap + to add your first task."
    />
  );
}
