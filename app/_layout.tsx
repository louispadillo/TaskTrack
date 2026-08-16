// ============================================================================
// app/_layout.tsx → the navigator that holds every screen
// ============================================================================
// It also loads Inter, the typeface the design is drawn in. We hold the splash
// screen up until the font is ready, because swapping fonts mid-render makes
// every screen visibly jump.
// ----------------------------------------------------------------------------

import { useEffect } from "react";
import { Platform } from "react-native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

// Keep the splash up while the font loads. The catch matters: on web this is a
// no-op that still returns a promise, and an unhandled rejection there would
// take the static render down.
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    // Drop the splash once the font is in — or if it failed, so a font problem
    // can never leave the user staring at a splash screen forever.
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  // Hold the first frame back on phones only. On web the page is rendered to
  // static HTML in Node, where fonts never "load" — blocking there would ship a
  // blank page, and blocking in the browser would mismatch that HTML during
  // hydration. The web simply draws in a fallback face for a moment instead.
  if (Platform.OS !== "web" && !fontsLoaded && !fontError) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="signup" />
      {/* Everything behind the login wall lives in the (tabs) group. */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
