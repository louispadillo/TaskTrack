// ============================================================================
// components/TaskRow.tsx → one task, as a white pill
// ============================================================================
// Two states, straight from the design:
//   • outstanding — an empty dark ring, dark text
//   • done        — a solid green disc, grey text with a line through it
//
// The whole row is the tap target rather than just the little circle, which
// makes it far easier to hit on a phone.
// ----------------------------------------------------------------------------

import { Pressable, Text, View, StyleSheet } from "react-native";
import { colors, layout, typography } from "./theme";
import type { Task } from "../lib/tasks";

type Props = {
  task: Task;
  onToggle: (task: Task) => void;
  disabled?: boolean;
};

export default function TaskRow({ task, onToggle, disabled }: Props) {
  const done = task.is_completed;

  return (
    <Pressable
      style={styles.row}
      onPress={() => onToggle(task)}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: done, disabled: !!disabled }}
      accessibilityLabel={task.title}
      accessibilityHint={done ? "Mark as not done" : "Mark as done"}
    >
      <View style={[styles.checkbox, done && styles.checkboxDone]} />
      <Text style={[styles.label, done && styles.labelDone]} numberOfLines={2}>
        {task.title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    padding: layout.cardPadding,
    backgroundColor: colors.card,
    borderRadius: layout.pill,
  },
  checkbox: {
    width: layout.icon,
    height: layout.icon,
    borderRadius: layout.pill,
    borderWidth: 1,
    borderColor: colors.checkbox,
  },
  checkboxDone: {
    backgroundColor: colors.checkboxDone,
    borderColor: colors.checkboxDoneBorder,
  },
  label: {
    ...typography.body,
    color: colors.bodyText,
    flexShrink: 1,
  },
  labelDone: {
    color: colors.doneText,
    textDecorationLine: "line-through",
  },
});
