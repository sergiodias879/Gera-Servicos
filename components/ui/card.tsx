import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  className?: string;
  testID?: string;
  onPress?: () => void;
  pressable?: boolean;
}

export function Card({
  children,
  style,
  className,
  testID,
  onPress,
  pressable = false,
}: CardProps) {
  const colors = useColors();

  const cardStyle: ViewStyle = {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderColor: colors.border,
    borderWidth: 0.5,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  };

  return (
    <View
      style={[cardStyle, style]}
      testID={testID}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
  },
});
