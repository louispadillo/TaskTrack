// ============================================================================
// components/AppHeader.tsx → the bar across the top of every signed-in screen
// ============================================================================
// Two shapes, both from the design:
//   • default — the ListDashes mark and the word TaskTrack
//   • back    — a dark round back button and a screen title (used on Profile)
//
// The circle on the right is a placeholder avatar: the design draws it as a
// red-to-blue gradient rather than a real photo. Tapping it opens Profile.
// ----------------------------------------------------------------------------

import { View, Text, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ListDashes, CaretLeft } from "./icons";
import { colors, fonts, layout, typography } from "./theme";

type Props = {
  /** Omit for the TaskTrack logo; pass a title to get the back-button variant. */
  title?: string;
};

export default function AppHeader({ title }: Props) {
  const router = useRouter();
  const showBack = title !== undefined;

  return (
    <View style={styles.header}>
      <View style={styles.left}>
        {showBack ? (
          <>
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              style={styles.backButton}
            >
              <LinearGradient
                colors={[colors.navPillFrom, colors.navPillTo]}
                style={StyleSheet.absoluteFill}
              />
              {/*
                The gradient above is absolutely positioned, and react-native-svg
                renders a bare <svg> with no positioning of its own. On the web
                that means CSS paints the gradient OVER the chevron whatever the
                order here — absolutely positioned siblings win against static
                content. Wrapping the icon in a positioned View puts it back on
                top. Native paints in document order and never had the problem.
              */}
              <View style={styles.backIcon}>
                <CaretLeft />
              </View>
            </Pressable>
            <Text style={typography.appTitle}>{title}</Text>
          </>
        ) : (
          <>
            <ListDashes />
            <Text style={typography.appTitle}>TaskTrack</Text>
          </>
        )}
      </View>

      <Pressable
        onPress={() => router.push("/profile")}
        accessibilityRole="button"
        accessibilityLabel="Open your profile"
      >
        <LinearGradient
          colors={[colors.avatarFrom, colors.avatarTo]}
          style={styles.avatar}
        >
          <Text style={styles.avatarLetter}>P</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: layout.headerPadding,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  backButton: {
    width: layout.avatar,
    height: layout.avatar,
    borderRadius: layout.pill,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    // The design's inset highlight and shade. Supported on the New Architecture,
    // which this project has enabled.
    boxShadow:
      "inset 0px -1px 1px 0px #181922, inset 0px 1px 1px 0px #6d6c7b",
  },
  backIcon: { zIndex: 1 },
  avatar: {
    width: layout.avatar,
    height: layout.avatar,
    borderRadius: layout.pill,
    // Borders sit inside the box in React Native, so the circle stays the
    // 40pt the design specifies rather than growing to 42pt.
    borderWidth: 1,
    borderColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 19,
    color: colors.onBlack,
  },
});
