// ============================================================================
// components/TaskListScreen.tsx → Home and Completed, which are the same screen
// ============================================================================
// The two differ only in which tasks they ask for and what the heading says, so
// they share this rather than existing as two near-identical copies that would
// drift apart the first time one of them was tweaked.
// ----------------------------------------------------------------------------

import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "./AppHeader";
import TaskRow from "./TaskRow";
import { useTasks } from "../hooks/useTasks";
import { colors, layout, listBottomInset, typography } from "./theme";

type Props = {
  /** false → outstanding tasks (Home), true → finished ones (Completed). */
  completed: boolean;
  /** The heading. Takes the count because Home's includes it. */
  title: (count: number) => string;
  /** Shown when there is nothing to list. */
  empty: string;
};

export default function TaskListScreen({ completed, title, empty }: Props) {
  const { tasks, loading, error, toggle } = useTasks(completed);

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.body}>
        <AppHeader />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            // The heading carries a count, so we wait rather than flash a zero.
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <>
              <Text style={typography.sectionTitle}>{title(tasks.length)}</Text>

              <View style={styles.list}>
                {tasks.map((task) => (
                  <TaskRow key={task.id} task={task} onToggle={toggle} />
                ))}

                {tasks.length === 0 && !error ? (
                  <Text style={styles.notice}>{empty}</Text>
                ) : null}
              </View>
            </>
          )}

          {error ? <Text style={styles.error}>{error}</Text> : null}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  body: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingTop: layout.bodyGap,
    paddingHorizontal: layout.gutter,
    gap: layout.sectionGap,
    // Stop the last row disappearing behind the floating nav bar.
    paddingBottom: listBottomInset,
  },
  list: { width: "100%", gap: layout.listGap },
  notice: { ...typography.body, color: colors.hint },
  error: { ...typography.body, color: colors.error },
});
