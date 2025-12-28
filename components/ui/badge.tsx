import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { useColors } from "@/hooks/use-colors";

export interface BadgeProps {
  label: string;
  variant?: "success" | "warning" | "error" | "neutral";
  size?: "small" | "medium";
  style?: ViewStyle;
  outlined?: boolean;
  testID?: string;
}

export function Badge({
  label,
  variant = "neutral",
  size = "medium",
  style,
  outlined = false,
  testID,
}: BadgeProps) {
  const colors = useColors();

  const getBackgroundColor = () => {
    switch (variant) {
      case "success":
        return colors.success;
      case "warning":
        return colors.warning;
      case "error":
        return colors.error;
      default:
        return colors.muted;
    }
  };

  const getTextColor = () => {
    if (outlined) {
      return getBackgroundColor();
    }
    return colors.background;
  };

  const backgroundColor = outlined ? "transparent" : getBackgroundColor();
  const borderColor = getBackgroundColor();
  const fontSize = size === "small" ? 11 : 12;
  const paddingVertical = size === "small" ? 4 : 6;
  const paddingHorizontal = size === "small" ? 8 : 12;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor,
          borderColor,
          borderWidth: outlined ? 1 : 0,
          paddingVertical,
          paddingHorizontal,
        },
        style,
      ]}
      testID={testID}
    >
      <Text
        style={[
          styles.label,
          {
            color: getTextColor(),
            fontSize,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 6,
    alignSelf: "flex-start",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontWeight: "600",
  },
});
