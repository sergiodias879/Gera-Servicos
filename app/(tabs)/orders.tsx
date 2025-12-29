import { View, TextInput, Pressable, ActivityIndicator, ScrollView } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useColors } from "@/hooks/use-colors";
import { useOrders } from "@/hooks/use-orders";
import { useClients } from "@/hooks/use-clients";
import { OrderModal } from "@/components/modals/order-modal";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState, useMemo } from "react";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return { label: "Concluída", variant: "success" as const };
    case "in_progress":
      return { label: "Em Progresso", variant: "warning" as const };
    case "pending":
      return { label: "Pendente", variant: "neutral" as const };
    case "cancelled":
      return { label: "Cancelada", variant: "error" as const };
    default:
      return { label: "Desconhecido", variant: "neutral" as const };
  }
};

export default function OrdersScreen() {
  const colors = useColors();
  const { orders, isLoadingOrders, createOrder, updateOrder, deleteOrder, isCreating, isUpdating, isDeleting } = useOrders();
  const { clients } = useClients();
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const client = clients.find((c) => c.id === order.clientId);
      const clientName = client?.name || "";
      return (
        clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [orders, clients, searchQuery]);

  const handleCreateOrder = async (data: any) => {
    await createOrder(data);
  };

  const handleUpdateOrder = async (data: any) => {
    if (selectedOrder) {
      await updateOrder({ id: selectedOrder.id, ...data });
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (confirm("Tem certeza que deseja cancelar esta ordem?")) {
      await deleteOrder({ id: orderId });
    }
  };

  const handleOpenModal = (order?: any) => {
    setSelectedOrder(order || null);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedOrder(null);
  };

  const getClientName = (clientId: number) => {
    return clients.find((c) => c.id === clientId)?.name || "Cliente desconhecido";
  };

  const renderOrderCard = (item: any) => {
    const statusInfo = getStatusBadge(item.status);
    const clientName = getClientName(item.clientId);

    return (
      <Card key={item.id} style={{ marginBottom: 12 }}>
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
                {item.title}
              </ThemedText>
              <ThemedText style={{ fontSize: 12, color: colors.muted }}>
                {clientName}
              </ThemedText>
              <ThemedText style={{ fontSize: 11, color: colors.muted, marginTop: 2 }}>
                📍 {item.address}
              </ThemedText>
            </View>
            <Badge label={statusInfo.label} variant={statusInfo.variant} size="small" />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <View>
              {item.scheduledDate && (
                <ThemedText style={{ fontSize: 12, color: colors.muted }}>
                  📅 {new Date(item.scheduledDate).toLocaleDateString("pt-BR")}
                  {item.scheduledTime && ` às ${item.scheduledTime}`}
                </ThemedText>
              )}
            </View>
            {item.value && (
              <ThemedText type="defaultSemiBold" style={{ color: colors.primary }}>
                R$ {(item.value / 100).toFixed(2)}
              </ThemedText>
            )}
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pressable
            onPress={() => handleOpenModal(item)}
            style={({ pressed }) => [
              {
                flex: 1,
                paddingVertical: 8,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <ThemedText style={{ fontSize: 14, color: colors.primary, fontWeight: "600" }}>
              Editar →
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => handleDeleteOrder(item.id)}
            disabled={isDeleting}
            style={{ padding: 8 }}
          >
            <MaterialIcons name="delete" size={20} color="#E74C3C" />
          </Pressable>
        </View>
      </Card>
    );
  };

  if (isLoadingOrders) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Header */}
        <View style={{ marginBottom: 16 }}>
          <ThemedText type="title" style={{ marginBottom: 4 }}>
            Ordens
          </ThemedText>
          <ThemedText style={{ color: colors.muted }}>
            {filteredOrders.length} ordem{filteredOrders.length !== 1 ? "s" : ""}
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
          onPress={() => handleOpenModal()}
          disabled={isCreating}
        >
          + Nova Ordem
        </Button>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => renderOrderCard(order))
        ) : (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <MaterialIcons name="inbox" size={48} color={colors.muted} />
            <ThemedText style={{ marginTop: 12, color: colors.muted }}>
              {searchQuery ? "Nenhuma ordem encontrada" : "Nenhuma ordem cadastrada"}
            </ThemedText>
          </View>
        )}
      </ScrollView>

      {/* Order Modal */}
      <OrderModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSave={selectedOrder ? handleUpdateOrder : handleCreateOrder}
        initialData={selectedOrder}
        isLoading={isCreating || isUpdating}
      />
    </ScreenContainer>
  );
}
