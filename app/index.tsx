// ============================================================================
// app/index.tsx → THE LOGIN SCREEN
// ============================================================================
//
// Three jobs, in order:
//   1. On launch, work out whether someone is already signed in. While we are
//      finding out we show a spinner rather than the form, so a returning user
//      never sees the login screen flash past on their way to /home.
//   2. Check what was typed (React Hook Form + the Zod rules in lib/validation).
//   3. Ask Supabase, and say something useful if it says no.
// ----------------------------------------------------------------------------

import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

import { supabase } from "../lib/supabase";
import { loginSchema, type LoginValues } from "../lib/validation";
import { describeAuthError } from "../lib/authErrors";
import AuthField from "../components/AuthField";
import { PrimaryButton, OAuthButton } from "../components/AuthButtons";
import { colors, layout, typography } from "../components/theme";

// A message about the form as a whole rather than about one box: a dead
// connection, say, or the "account created" note we arrive with from sign-up.
// The design has no dedicated slot for either, so we borrow its error styling.
type FormMessage = { text: string; tone: "error" | "hint" };

export default function LoginScreen() {
  const router = useRouter();
  // Sign-up hands us a note about what just happened, via the route.
  const { notice } = useLocalSearchParams<{ notice?: string }>();

  // True until Supabase has told us whether a saved session exists.
  const [restoring, setRestoring] = useState(true);
  const [formMessage, setFormMessage] = useState<FormMessage | null>(null);
  const [oauthBusy, setOauthBusy] = useState(false);

  const showError = (text: string) => setFormMessage({ text, tone: "error" });

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched", // complain once you leave a box, not on every keystroke
  });

  // Fires immediately with the restored session (or null), and again whenever
  // the user signs in — including when they come back from Google or GitHub.
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace("/home");
      } else {
        setRestoring(false);
      }
    });
    return () => data.subscription.unsubscribe();
  }, [router]);

  // Sign-up redirects here after creating the account, and tells us which of
  // the two things happened so we can say the right thing.
  useEffect(() => {
    if (notice === "created") {
      setFormMessage({
        text: "Account created. Log in to continue.",
        tone: "hint",
      });
    } else if (notice === "confirm") {
      setFormMessage({
        text: "Account created. Check your inbox to confirm your email, then log in.",
        tone: "hint",
      });
    }
  }, [notice]);

  async function onSubmit(values: LoginValues) {
    setFormMessage(null);
    try {
      const { error } = await supabase.auth.signInWithPassword(values);
      if (!error) return; // the listener above moves us to /home

      const problem = describeAuthError(error);
      if (problem.field) {
        setError(problem.field, { message: problem.message });
      } else {
        showError(problem.message);
      }
    } catch {
      // Never let a thrown error take the screen down with it.
      showError("Something went wrong. Please try again.");
    }
  }

  async function signInWith(provider: "google" | "github") {
    setFormMessage(null);
    setOauthBusy(true);
    try {
      // In a browser we drive this tab over to the provider and let Supabase
      // read the ?code= off the URL when it sends us back.
      if (Platform.OS === "web") {
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: { redirectTo: `${window.location.origin}/home` },
        });
        if (error) showError(describeAuthError(error).message);
        return; // on success the page is already leaving
      }

      // On a phone there is no tab to navigate, so we open a browser sheet and
      // trade the returned code for a session ourselves.
      const redirectTo = Linking.createURL("/home");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo, skipBrowserRedirect: true },
      });
      if (error || !data?.url) {
        showError(
          error ? describeAuthError(error).message : "Could not start sign-in."
        );
        return;
      }

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      if (result.type === "success") {
        const code = Linking.parse(result.url).queryParams?.code as string | undefined;
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) showError(describeAuthError(exchangeError).message);
        }
      }
    } catch {
      showError("Could not start sign-in. Please try again.");
    } finally {
      setOauthBusy(false);
    }
  }

  // The splash the assignment asks for: shown only while the session is being
  // restored, so it is usually a single frame and never seen at all.
  if (restoring) {
    return (
      <SafeAreaView style={styles.screen} edges={["top"]}>
        <View style={styles.restoring}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const busy = isSubmitting || oauthBusy;

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={typography.title}>Welcome to Task Track</Text>

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
                editable={!busy}
                keyboardType="email-address"
                autoComplete="email"
                textContentType="emailAddress"
                // The design tucks 4pt above and below this first block.
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
                message={errors.password?.message}
                tone="error"
                editable={!busy}
                secureTextEntry
                autoComplete="current-password"
                textContentType="password"
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
          label="Login"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          disabled={oauthBusy}
        />

        <View style={styles.divider} />

        <View style={styles.footerGroup}>
          <View style={styles.oauthGroup}>
            <OAuthButton
              label="Continue with Google"
              variant="google"
              onPress={() => signInWith("google")}
              disabled={busy}
            />
            <OAuthButton
              label="Continue with Github"
              variant="github"
              onPress={() => signInWith("github")}
              disabled={busy}
            />
          </View>

          <Pressable onPress={() => router.push("/signup")} accessibilityRole="link">
            <Text style={typography.footer}>
              No Account yet? <Text style={styles.footerLink}>Sign up</Text>
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
  restoring: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  fields: { width: "100%", gap: layout.fieldGap },
  firstField: { paddingVertical: 4, gap: 0 },
  errorText: { color: colors.error },
  hintText: { color: colors.hint },
  divider: { width: "100%", height: 1, backgroundColor: colors.divider },
  footerGroup: { width: "100%", alignItems: "center", gap: layout.sectionGap },
  oauthGroup: { width: "100%", gap: 8 },
  footerLink: { textDecorationLine: "underline" },
});
