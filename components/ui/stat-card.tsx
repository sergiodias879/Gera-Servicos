import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { Card } from "./card";
import { ThemedText } from "@/components/themed-text";

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  style?: ViewStyle;
  testID?: string;
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  trendValue,
  style,
  testID,
}: StatCardProps) {
  const colors = useColors();

  const getTrendColor = (): string => {
    switch (trend) {
      case "up":
        return colors.success;
      case "down":
        return colors.error;
      default:
        return colors.primary;
    }
  };

  return (
    <Card style={[styles.container, style] as unknown as ViewStyle} testID={testID}>
      <View style={styles.header}>
        <ThemedText type="defaultSemiBold" style={styles.label}>
          {label}
        </ThemedText>
        {icon && (
          <View
            style={[
              styles.icon,
              { backgroundColor: `${colors.primary}15` },
            ]}
          >
            {icon}
          </View>
        )}
      </View>

      <View style={styles.content}>
        <ThemedText type="title" style={styles.value}>
          {value}
        </ThemedText>

        {trend && trendValue && (
          <ThemedText
            style={[
              styles.trend,
              { color: getTrendColor() },
            ]}
          >
            {trend === "up" ? "↑" : "↓"} {trendValue}
          </ThemedText>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 120,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    flex: 1,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    gap: 4,
  },
  value: {
    fontSize: 28,
    fontWeight: "bold",
  },
  trend: {
    fontSize: 12,
    fontWeight: "600",
  },
});
