import React from "react";
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from "react-native";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

export interface ButtonProps {
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "tertiary";
  size?: "small" | "medium" | "large";
  children: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
}

export function Button({
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
  size = "medium",
  children,
  style,
  testID,
}: ButtonProps) {
  const colors = useColors();
  const primaryColor = colors.primary;
  const backgroundColor = colors.background;
  const foregroundColor = colors.foreground;
  const surfaceColor = colors.surface;

  const handlePress = async () => {
    if (!disabled && !loading && onPress) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const getBackgroundColor = () => {
    if (variant === "primary") return primaryColor;
    if (variant === "secondary") return surfaceColor;
    return "transparent";
  };

  const getTextColor = () => {
    if (variant === "primary") return backgroundColor;
    if (variant === "secondary") return foregroundColor;
    return primaryColor;
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return { paddingHorizontal: 12, paddingVertical: 8, minHeight: 32 };
      case "large":
        return { paddingHorizontal: 24, paddingVertical: 16, minHeight: 56 };
      default:
        return { paddingHorizontal: 16, paddingVertical: 12, minHeight: 48 };
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          opacity: disabled ? 0.5 : pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
        getSizeStyles(),
        style,
      ]}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: getTextColor(),
              fontSize: size === "small" ? 14 : size === "large" ? 18 : 16,
            },
          ]}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  text: {
    fontWeight: "600",
  },
});
