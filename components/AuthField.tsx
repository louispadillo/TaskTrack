// ============================================================================
// components/AuthField.tsx → one labelled box plus the line of text beneath it
// ============================================================================
// Both auth screens are built out of these. The line underneath does double
// duty, exactly as the design shows: grey when it is only a hint ("6-12
// Characters"), red when it is a genuine complaint ("Incorrect email").
// ----------------------------------------------------------------------------

import { View, TextInput, Text, StyleSheet } from "react-native";
import type { StyleProp, ViewStyle, TextInputProps } from "react-native";
import { colors, layout, typography } from "./theme";

type Props = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  /** The line under the box. Nothing is rendered when this is empty. */
  message?: string | null;
  /** Grey advice, or a red problem. */
  tone?: "hint" | "error";
  editable?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
  autoComplete?: TextInputProps["autoComplete"];
  textContentType?: TextInputProps["textContentType"];
  containerStyle?: StyleProp<ViewStyle>;
};

export default function AuthField({
  placeholder,
  value,
  onChangeText,
  onBlur,
  message,
  tone = "error",
  editable = true,
  secureTextEntry,
  keyboardType,
  autoCapitalize = "none",
  autoComplete,
  textContentType,
  containerStyle,
}: Props) {
  return (
    <View style={[styles.block, containerStyle]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.bodyText}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        editable={editable}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        textContentType={textContentType}
        // Screen readers announce the problem instead of only showing it.
        accessibilityLabel={placeholder}
        accessibilityHint={message ?? undefined}
      />
      {message ? (
        <Text style={[styles.message, tone === "error" ? styles.error : styles.hint]}>
          {message}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    width: "100%",
    gap: layout.messageGap,
  },
  input: {
    width: "100%",
    height: layout.borderedHeight,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: layout.radius,
    paddingHorizontal: layout.controlPaddingHorizontal,
    paddingVertical: 0,
    color: colors.bodyText,
    // Deliberately no lineHeight here. The box is a fixed 43pt and Android
    // clips or vertically offsets a TextInput when both are set, so we let the
    // field centre its own text instead.
    fontFamily: typography.control.fontFamily,
    fontSize: typography.control.fontSize,
  },
  message: typography.message,
  error: { color: colors.error },
  hint: { color: colors.hint },
});
