// ============================================================================
// app/(tabs)/profile.tsx → PROFILE: who you are, and the way out
// ============================================================================
// Reached from the avatar in the header rather than from the nav bar, which is
// why the design shows no nav bar here.
//
// Signing out does not navigate anywhere itself. The guard in (tabs)/_layout is
// listening for the session ending and does the redirect — one place decides
// where a signed-out user goes, rather than every screen having an opinion.
// ----------------------------------------------------------------------------

import { useEffect, useState } from "react";
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { User } from "@supabase/supabase-js";

import AppHeader from "../../components/AppHeader";
import { supabase } from "../../lib/supabase";
import { colors, layout, typography } from "../../components/theme";

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth
      .getUser()
      .then(({ data }) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  async function signOut() {
    setSigningOut(true);
    setError(null);
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        setError("Could not sign out. Check your connection and try again.");
        setSigningOut(false);
      }
      // On success the layout's auth listener takes it from here.
    } catch {
      setError("Could not sign out. Check your connection and try again.");
      setSigningOut(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.body}>
        <AppHeader title="Profile" />

        <Text style={typography.appTitle}>Currently signed in as</Text>
        <Text style={styles.email}>{user?.email ?? "…"}</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          style={[styles.signOut, signingOut && styles.signOutInactive]}
          onPress={signOut}
          disabled={signingOut}
          accessibilityRole="button"
          accessibilityState={{ disabled: signingOut, busy: signingOut }}
          accessibilityLabel={signingOut ? "Sign out, in progress" : "Sign out"}
        >
          {signingOut ? (
            <ActivityIndicator size="small" color={colors.onBlack} />
          ) : (
            <Text style={styles.signOutLabel}>Sign out</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  body: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    gap: layout.bodyGap,
  },
  email: { ...typography.body, color: colors.bodyText },
  error: {
    ...typography.body,
    color: colors.error,
    paddingHorizontal: layout.gutter,
    textAlign: "center",
  },
  // The design pins this to the bottom rather than letting it follow the text.
  signOut: {
    position: "absolute",
    bottom: layout.navBottom,
    width: 300,
    height: 51,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.black,
    borderRadius: layout.pill,
  },
  signOutInactive: { opacity: 0.6 },
  signOutLabel: { ...typography.body, color: colors.onBlack },
});
