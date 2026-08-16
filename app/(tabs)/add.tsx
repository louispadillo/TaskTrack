// ============================================================================
// app/(tabs)/add.tsx → ADD: create a task
// ============================================================================
// One box and one button, as the design has it. On success we clear the box and
// move to Home, where the new task is waiting — useTasks reloads on focus.
// ----------------------------------------------------------------------------

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import AppHeader from "../../components/AppHeader";
import { createTask } from "../../lib/tasks";
import { colors, layout, listBottomInset, typography } from "../../components/theme";

export default function AddScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmed = title.trim();
  // The database rejects blank titles too; this just stops the pointless round
  // trip and greys the button out so it is obvious why nothing happens.
  const canSubmit = trimmed.length > 0 && !saving;

  async function onSubmit() {
    if (!canSubmit) return;

    setSaving(true);
    setError(null);
    try {
      await createTask(trimmed);
      setTitle("");
      router.push("/home");
    } catch {
      setError("Could not save that task. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.body}>
        <AppHeader />

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={typography.sectionTitle}>Create a task</Text>

          <View style={styles.fields}>
            <TextInput
              style={styles.input}
              placeholder="Enter task"
              placeholderTextColor={colors.bodyText}
              value={title}
              onChangeText={setTitle}
              editable={!saving}
              maxLength={200} // matches the database's own limit
              returnKeyType="done"
              onSubmitEditing={onSubmit}
              accessibilityLabel="Task"
            />

            <Pressable
              style={[styles.submit, !canSubmit && styles.submitInactive]}
              onPress={onSubmit}
              disabled={!canSubmit}
              accessibilityRole="button"
              accessibilityState={{ disabled: !canSubmit, busy: saving }}
              accessibilityLabel={saving ? "Submit, in progress" : "Submit"}
            >
              {saving ? (
                <ActivityIndicator size="small" color={colors.onBlack} />
              ) : (
                <Text style={styles.submitLabel}>Submit</Text>
              )}
            </Pressable>

            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// Both controls are 51pt tall in the design: 16pt padding, a 19pt line, 16pt.
const CONTROL_HEIGHT = 51;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  body: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingTop: layout.bodyGap,
    paddingHorizontal: layout.gutter,
    gap: layout.sectionGap,
    paddingBottom: listBottomInset,
  },
  fields: { width: "100%", gap: layout.listGap },
  input: {
    width: "100%",
    height: CONTROL_HEIGHT,
    paddingHorizontal: layout.cardPadding,
    paddingVertical: 0,
    backgroundColor: colors.card,
    borderRadius: layout.pill,
    color: colors.bodyText,
    // No lineHeight on a fixed-height TextInput — Android clips it.
    fontFamily: typography.body.fontFamily,
    fontSize: typography.body.fontSize,
    letterSpacing: typography.body.letterSpacing,
  },
  submit: {
    width: "100%",
    height: CONTROL_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.black,
    borderRadius: layout.pill,
  },
  submitInactive: { opacity: 0.6 },
  submitLabel: { ...typography.body, color: colors.onBlack },
  error: { ...typography.body, color: colors.error },
});
