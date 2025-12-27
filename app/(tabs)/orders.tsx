import { View, FlatList, TextInput, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useColors } from "@/hooks/use-colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";

// Mock data
const mockOrders = [
  {
    id: "1",
    client: "João Silva",
    date: "26/12/2024",
    time: "10:00",
    address: "Rua A, 123",
    status: "in_progress",
    value: "R$ 150",
  },
  {
    id: "2",
    client: "Maria Santos",
    date: "26/12/2024",
    time: "14:00",
    address: "Av. B, 456",
    status: "pending",
    value: "R$ 200",
  },
  {
    id: "3",
    client: "Pedro Costa",
    date: "26/12/2024",
    time: "16:00",
    address: "Rua C, 789",
    status: "completed",
    value: "R$ 180",
  },
  {
    id: "4",
    client: "Ana Oliveira",
    date: "27/12/2024",
    time: "09:00",
    address: "Av. D, 321",
    status: "pending",
    value: "R$ 220",
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

export default function OrdersScreen() {
  const colors = useColors();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = mockOrders.filter(
    (order) =>
      order.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderOrderCard = (item: any) => {
    const statusInfo = getStatusBadge(item.status);
    return (
      <Card
        style={{
          marginBottom: 12,
        }}
      >
        <View style={{ marginBottom: 12 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 8,
            }}
          >
            <View style={{ flex: 1 }}>
              <ThemedText type="defaultSemiBold" style={{ marginBottom: 4 }}>
                {item.client}
              </ThemedText>
              <ThemedText style={{ fontSize: 12, color: colors.muted }}>
                {item.address}
              </ThemedText>
            </View>
            <Badge label={statusInfo.label} variant={statusInfo.variant} size="small" />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <ThemedText style={{ fontSize: 12, color: colors.muted }}>
              {item.date} às {item.time}
            </ThemedText>
            <ThemedText type="defaultSemiBold" style={{ color: colors.primary }}>
              {item.value}
            </ThemedText>
          </View>
        </View>
        <Pressable
          style={({ pressed }) => [
            {
              paddingVertical: 8,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <ThemedText style={{ fontSize: 14, color: colors.primary, fontWeight: "600" }}>
            Ver Detalhes →
          </ThemedText>
        </Pressable>
      </Card>
    );
  };

  return (
    <ScreenContainer className="flex-1">
      {/* Header */}
      <View style={{ marginBottom: 16 }}>
        <ThemedText type="title" style={{ marginBottom: 4 }}>
          Ordens
        </ThemedText>
        <ThemedText style={{ color: colors.muted }}>
          Gerenciar serviços de limpeza
        </ThemedText>
      </View>

      {/* Search Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
          backgroundColor: colors.surface,
          borderRadius: 8,
          paddingHorizontal: 12,
          borderColor: colors.border,
          borderWidth: 1,
        }}
      >
        <MaterialIcons name="search" size={20} color={colors.muted} />
        <TextInput
          placeholder="Buscar por cliente ou endereço"
          placeholderTextColor={colors.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{
            flex: 1,
            paddingVertical: 12,
            paddingHorizontal: 8,
            color: colors.foreground,
          }}
        />
      </View>

      {/* New Order Button */}
      <Button
        variant="primary"
        size="medium"
        style={{ marginBottom: 16 }}
        onPress={() => {
          // TODO: Navigate to new order screen
        }}
      >
        + Nova Ordem
      </Button>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        renderItem={({ item }) => renderOrderCard(item)}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <MaterialIcons name="inbox" size={48} color={colors.muted} />
            <ThemedText style={{ marginTop: 12, color: colors.muted }}>
              Nenhuma ordem encontrada
            </ThemedText>
          </View>
        }
      />
    </ScreenContainer>
  );
}
