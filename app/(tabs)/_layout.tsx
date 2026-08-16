// ============================================================================
// app/(tabs)/_layout.tsx → the signed-in area
// ============================================================================
// One guard for every screen inside this folder. Putting it here rather than in
// each screen means a new screen added later is protected by default instead of
// only if somebody remembers to protect it.
//
// The (tabs) folder name is in brackets, so it groups the files without adding
// anything to the URL — Home is still /home, not /tabs/home.
// ----------------------------------------------------------------------------

import { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Tabs, useRouter } from "expo-router";

import { supabase } from "../../lib/supabase";
import TabBar from "../../components/TabBar";
import { colors } from "../../components/theme";

export default function AppLayout() {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "signedIn" | "signedOut">("checking");

  useEffect(() => {
    // Fires straight away with the restored session, and again on sign-out —
    // so signing out from Profile bounces us back to the login screen.
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setStatus("signedIn");
      } else {
        setStatus("signedOut");
        router.replace("/");
      }
    });
    return () => data.subscription.unsubscribe();
  }, [router]);

  if (status === "checking") {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Render nothing for the instant between "no session" and the redirect
  // landing, so a signed-out user never sees the inside of the app.
  if (status === "signedOut") return null;

  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="add" />
      <Tabs.Screen name="completed" />
      {/* Reached from the avatar in the header, so it gets no tab button. */}
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
});
