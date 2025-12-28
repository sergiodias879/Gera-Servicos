import { ScrollView, View, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { ThemedText } from "@/components/themed-text";
import { StatCard } from "@/components/ui/stat-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useColors } from "@/hooks/use-colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

// Mock data for demonstration
const mockStats = [
  {
    id: "1",
    label: "Serviços Hoje",
    value: "5",
    trend: "up" as const,
    trendValue: "+2",
  },
  {
    id: "2",
    label: "Faturamento",
    value: "R$ 2.450",
    trend: "up" as const,
    trendValue: "+15%",
  },
  {
    id: "3",
    label: "Clientes Ativos",
    value: "28",
    trend: "neutral" as const,
    trendValue: "Sem mudanças",
  },
  {
    id: "4",
    label: "Taxa Conclusão",
    value: "92%",
    trend: "up" as const,
    trendValue: "+5%",
  },
];

const mockOrders = [
  {
    id: "1",
    client: "João Silva",
    date: "Hoje, 10:00",
    status: "in_progress" as const,
    value: "R$ 150",
  },
  {
    id: "2",
    client: "Maria Santos",
    date: "Hoje, 14:00",
    status: "pending" as const,
    value: "R$ 200",
  },
  {
    id: "3",
    client: "Pedro Costa",
    date: "Hoje, 16:00",
    status: "completed" as const,
    value: "R$ 180",
  },
  {
    id: "4",
    client: "Ana Oliveira",
    date: "Amanhã, 09:00",
    status: "pending" as const,
    value: "R$ 220",
  },
  {
    id: "5",
    client: "Carlos Mendes",
    date: "Amanhã, 11:00",
    status: "pending" as const,
    value: "R$ 190",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return { label: "Concluída", variant: "success" as const };
    case "in_progress":
      return { label: "Em Progresso", variant: "warning" as const };
    case "pending":
      return { label: "Pendente", variant: "neutral" as const };
    default:
      return { label: "Desconhecido", variant: "neutral" as const };
  }
};

export default function DashboardScreen() {
  const colors = useColors();

  const renderStatCard = (item: any) => (
    <View style={{ flex: 1, marginRight: item.id !== "4" ? 8 : 0 }}>
      <StatCard
        label={item.label}
        value={item.value}
        trend={item.trend}
        trendValue={item.trendValue}
        icon={
          <MaterialIcons
            name="trending-up"
            size={24}
            color={colors.primary}
          />
        }
      />
    </View>
  );

  const renderOrderCard = (item: any) => {
    const statusInfo = getStatusBadge(item.status);
    return (
      <Card
        style={{
          marginBottom: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1 }}>
          <ThemedText type="defaultSemiBold" style={{ marginBottom: 4 }}>
            {item.client}
          </ThemedText>
          <ThemedText style={{ fontSize: 12, color: colors.muted }}>
            {item.date}
          </ThemedText>
        </View>
        <View style={{ alignItems: "flex-end", gap: 8 }}>
          <Badge label={statusInfo.label} variant={statusInfo.variant} size="small" />
          <ThemedText type="defaultSemiBold" style={{ fontSize: 14 }}>
            {item.value}
          </ThemedText>
        </View>
      </Card>
    );
  };

  return (
    <ScreenContainer className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Header */}
        <View style={{ marginBottom: 24 }}>
          <ThemedText type="title" style={{ marginBottom: 4 }}>
            Dashboard
          </ThemedText>
          <ThemedText style={{ color: colors.muted }}>
            Bem-vindo ao CleanPro
          </ThemedText>
        </View>

        {/* Stats Grid */}
        <View style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
            {mockStats.slice(0, 2).map((stat) => renderStatCard(stat))}
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {mockStats.slice(2, 4).map((stat) => renderStatCard(stat))}
          </View>
        </View>

        {/* Recent Orders Section */}
        <View>
          <ThemedText type="subtitle" style={{ marginBottom: 12 }}>
            Ordens Recentes
          </ThemedText>
          {mockOrders.map((order) => renderOrderCard(order))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
