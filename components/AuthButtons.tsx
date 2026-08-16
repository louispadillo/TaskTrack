// ============================================================================
// components/AuthButtons.tsx → the three button styles the design calls for
// ============================================================================
// PrimaryButton is the blue one that submits the form. It swaps its label for a
// spinner while the request is in flight and refuses to be pressed twice, which
// is what stops a double-tap turning into two sign-up attempts.
//
// OAuthButton is the Google (outlined) and GitHub (solid black) pair.
// ----------------------------------------------------------------------------

import { Pressable, Text, ActivityIndicator, StyleSheet } from "react-native";
import { colors, layout, typography } from "./theme";

type PrimaryProps = {
  label: string;
  onPress: () => void;
  /** Shows the spinner and blocks further presses. */
  loading?: boolean;
  disabled?: boolean;
};

export function PrimaryButton({ label, onPress, loading, disabled }: PrimaryProps) {
  const inactive = loading || disabled;

  return (
    <Pressable
      style={[styles.filled, styles.primary, inactive && styles.inactive]}
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      accessibilityLabel={loading ? `${label}, in progress` : label}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.onPrimary} />
      ) : (
        <Text style={[typography.control, styles.onPrimary]}>{label}</Text>
      )}
    </Pressable>
  );
}

type OAuthProps = {
  label: string;
  onPress: () => void;
  /** "google" is the outlined treatment, "github" the solid black one. */
  variant: "google" | "github";
  disabled?: boolean;
};

export function OAuthButton({ label, onPress, variant, disabled }: OAuthProps) {
  const isGoogle = variant === "google";

  return (
    <Pressable
      style={[
        isGoogle ? styles.outlined : styles.filled,
        isGoogle ? styles.google : styles.github,
        disabled && styles.inactive,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={[typography.control, isGoogle ? styles.onGoogle : styles.onBlack]}>
        {label}
      </Text>
    </Pressable>
  );
}

const base = {
  width: "100%",
  borderRadius: layout.radius,
  paddingHorizontal: layout.controlPaddingHorizontal,
  alignItems: "center",
  justifyContent: "center",
} as const;

const styles = StyleSheet.create({
  // No border, so the design's 41pt height is the whole control.
  filled: { ...base, height: layout.filledHeight },
  // A 1pt border top and bottom takes the same control to 43pt.
  outlined: { ...base, height: layout.borderedHeight, borderWidth: 1 },

  primary: { backgroundColor: colors.primary },
  google: { borderColor: colors.black, backgroundColor: "transparent" },
  github: { backgroundColor: colors.black },

  onPrimary: { color: colors.onPrimary },
  onGoogle: { color: colors.bodyText },
  onBlack: { color: colors.onBlack },

  inactive: { opacity: 0.6 },
});
