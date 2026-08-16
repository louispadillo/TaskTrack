// ============================================================================
// components/TabBar.tsx → the floating navigation pill
// ============================================================================
// Not a standard tab bar: the design draws a translucent dark capsule hovering
// over the content, with a darker capsule sliding behind whichever tab is
// active. So we render it ourselves and hand it to <Tabs> via its tabBar prop.
//
// The maths, from the design: each tab is 56pt wide (a 24pt icon with 16pt
// either side) and they sit 8pt apart inside 8pt of padding —
// 8 + 56 + 8 + 56 + 8 + 56 + 8 = 200pt, which is the width Figma gives the bar.
// ----------------------------------------------------------------------------

import { View, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { House, Plus, CheckCircle } from "./icons";
import { colors, layout } from "./theme";

const TABS = [
  { name: "home", Icon: House, label: "Your tasks" },
  { name: "add", Icon: Plus, label: "Create a task" },
  { name: "completed", Icon: CheckCircle, label: "Completed tasks" },
] as const;

const STEP = layout.navItem + layout.navGap; // 64pt from one tab to the next

export default function TabBar({ state, navigation }: BottomTabBarProps) {
  const current = state.routes[state.index]?.name;
  const activeIndex = TABS.findIndex((tab) => tab.name === current);

  // Profile is reached from the avatar rather than the bar, and the design
  // shows no bar on it. Anything that is not one of the three tabs hides it.
  if (activeIndex === -1) return null;

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View style={styles.bar}>
        <LinearGradient
          colors={[colors.navFrom, colors.navTo]}
          style={StyleSheet.absoluteFill}
        />

        {/* The capsule that sits behind the active tab. */}
        <LinearGradient
          colors={[colors.navPillFrom, colors.navPillTo]}
          style={[
            styles.activePill,
            { left: layout.navPadding + activeIndex * STEP },
          ]}
        />

        {TABS.map(({ name, Icon, label }, index) => (
          <Pressable
            key={name}
            style={styles.tab}
            onPress={() => {
              // Never push a second copy of the screen you are already on.
              if (index !== activeIndex) navigation.navigate(name);
            }}
            accessibilityRole="tab"
            accessibilityState={{ selected: index === activeIndex }}
            accessibilityLabel={label}
          >
            <Icon />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Floats over the content. box-none lets taps outside the pill fall through
  // to whatever is underneath.
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: layout.navBottom,
    alignItems: "center",
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: layout.navGap,
    padding: layout.navPadding,
    borderRadius: layout.pill,
    overflow: "hidden",
    boxShadow:
      "inset 0px -1px 1px 0px #181922, inset 0px 1px 1px 0px #6d6c7b",
  },
  activePill: {
    position: "absolute",
    width: layout.navItem,
    height: 40,
    borderRadius: layout.pill,
  },
  tab: {
    width: layout.navItem,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: layout.pill,
  },
});
