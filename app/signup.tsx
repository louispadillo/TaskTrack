// ============================================================================
// app/signup.tsx → THE SIGN-UP SCREEN
// ============================================================================
//
// Its own route now, rather than two buttons sharing the login screen.
//
// The line under each password box is the interesting part: it starts as grey
// advice ("6-12 Characters") and turns red once the rule is actually broken.
// Same words, same position — only the colour changes. That is what the design
// specifies, and it means the requirement is stated before you trip over it.
// ----------------------------------------------------------------------------

import { useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { supabase } from "../lib/supabase";
import { signUpSchema, PASSWORD_HINT, type SignUpValues } from "../lib/validation";
import { describeAuthError } from "../lib/authErrors";
import AuthField from "../components/AuthField";
import { PrimaryButton } from "../components/AuthButtons";
import { colors, layout, typography } from "../components/theme";

type FormMessage = { text: string; tone: "error" | "hint" };

export default function SignUpScreen() {
  const router = useRouter();
  const [formMessage, setFormMessage] = useState<FormMessage | null>(null);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
    mode: "onTouched",
  });

  async function onSubmit(values: SignUpValues) {
    setFormMessage(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (error) {
        const problem = describeAuthError(error);
        if (problem.field) {
          setError(problem.field, { message: problem.message });
        } else {
          setFormMessage({ text: problem.message, tone: "error" });
        }
        return;
      }

      // Supabase either signs the new user straight in, or — when the project
      // requires email confirmation — hands back no session at all.
      //
      // Either way we send them to the login screen to sign in deliberately.
      // When a session WAS handed back we have to end it first: leaving it in
      // place would have the login screen spot it and bounce them to /home,
      // which is exactly what we are trying not to do.
      if (data.session) {
        await supabase.auth.signOut();
        router.replace({ pathname: "/", params: { notice: "created" } });
      } else {
        router.replace({ pathname: "/", params: { notice: "confirm" } });
      }
    } catch {
      setFormMessage({
        text: "Something went wrong. Please try again.",
        tone: "error",
      });
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={typography.title}>Create an account</Text>

        <View style={styles.fields}>
          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange, onBlur } }) => (
              <AuthField
                placeholder="Email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                message={errors.email?.message}
                tone="error"
                editable={!isSubmitting}
                keyboardType="email-address"
                autoComplete="email"
                textContentType="emailAddress"
                containerStyle={styles.firstField}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { value, onChange, onBlur } }) => (
              <AuthField
                placeholder="Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                // Grey advice until it is broken, then the same words in red.
                message={errors.password?.message ?? PASSWORD_HINT}
                tone={errors.password ? "error" : "hint"}
                editable={!isSubmitting}
                secureTextEntry
                autoComplete="new-password"
                textContentType="newPassword"
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { value, onChange, onBlur } }) => (
              <AuthField
                placeholder="Confirm Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                message={errors.confirmPassword?.message ?? PASSWORD_HINT}
                tone={errors.confirmPassword ? "error" : "hint"}
                editable={!isSubmitting}
                secureTextEntry
                autoComplete="new-password"
                textContentType="newPassword"
              />
            )}
          />
        </View>

        {formMessage ? (
          <Text
            style={[
              typography.message,
              formMessage.tone === "error" ? styles.errorText : styles.hintText,
            ]}
          >
            {formMessage.text}
          </Text>
        ) : null}

        <PrimaryButton
          label="Sign Up"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
        />

        <View style={styles.divider} />

        <View style={styles.footerGroup}>
          <Pressable onPress={() => router.replace("/")} accessibilityRole="link">
            <Text style={typography.footer}>
              Go back to <Text style={styles.footerLink}>login page</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  page: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingVertical: layout.screenPaddingVertical,
    gap: layout.sectionGap,
  },
  fields: { width: "100%", gap: layout.fieldGap },
  firstField: { paddingVertical: 4, gap: 0 },
  errorText: { color: colors.error },
  hintText: { color: colors.hint },
  divider: { width: "100%", height: 1, backgroundColor: colors.divider },
  footerGroup: { width: "100%", alignItems: "center" },
  footerLink: { textDecorationLine: "underline" },
});
