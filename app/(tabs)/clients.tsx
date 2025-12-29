import { View, FlatList, TextInput, Pressable, ActivityIndicator, ScrollView } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useColors } from "@/hooks/use-colors";
import { useClients } from "@/hooks/use-clients";
import { ClientModal } from "@/components/modals/client-modal";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState, useMemo } from "react";

export default function ClientsScreen() {
  const colors = useColors();
  const { clients, isLoadingClients, createClient, updateClient, deleteClient, isCreating, isUpdating, isDeleting } = useClients();
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);

  const filteredClients = useMemo(() => {
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.phone && client.phone.includes(searchQuery)) ||
        (client.email && client.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [clients, searchQuery]);

  const handleCreateClient = async (data: any) => {
    await createClient(data);
  };

  const handleUpdateClient = async (data: any) => {
    if (selectedClient) {
      await updateClient({ id: selectedClient.id, ...data });
    }
  };

  const handleDeleteClient = async (clientId: number) => {
    if (confirm("Tem certeza que deseja deletar este cliente?")) {
      await deleteClient({ id: clientId });
    }
  };

  const handleOpenModal = (client?: any) => {
    setSelectedClient(client || null);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedClient(null);
  };

  const renderClientCard = (item: any) => (
    <Card style={{ marginBottom: 12 }}>
      <View style={{ marginBottom: 12 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 8,
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: colors.primary,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <ThemedText
              style={{
                color: colors.background,
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {item.name.charAt(0).toUpperCase()}
            </ThemedText>
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText type="defaultSemiBold" style={{ marginBottom: 4 }}>
              {item.name}
            </ThemedText>
            <ThemedText style={{ fontSize: 12, color: colors.muted }}>
              {item.email || "Sem email"}
            </ThemedText>
          </View>
          <Pressable
            onPress={() => handleDeleteClient(item.id)}
            disabled={isDeleting}
            style={{ padding: 8 }}
          >
            <MaterialIcons name="delete" size={20} color="#E74C3C" />
          </Pressable>
        </View>
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 8 }}>
          {item.phone && (
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                flex: 1,
              }}
            >
              <MaterialIcons name="phone" size={16} color={colors.primary} />
              <ThemedText style={{ fontSize: 12, color: colors.primary }}>
                {item.phone}
              </ThemedText>
            </Pressable>
          )}
          {item.email && (
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                flex: 1,
              }}
            >
              <MaterialIcons name="email" size={16} color={colors.primary} />
              <ThemedText style={{ fontSize: 12, color: colors.primary }}>
                Email
              </ThemedText>
            </Pressable>
          )}
        </View>
        {item.address && (
          <ThemedText style={{ fontSize: 11, color: colors.muted }}>
            📍 {item.address}
          </ThemedText>
        )}
      </View>
      <Pressable
        onPress={() => handleOpenModal(item)}
        style={({ pressed }) => [
          {
            paddingVertical: 8,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <ThemedText style={{ fontSize: 14, color: colors.primary, fontWeight: "600" }}>
          Editar →
        </ThemedText>
      </Pressable>
    </Card>
  );

  if (isLoadingClients) {
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
            Clientes
          </ThemedText>
          <ThemedText style={{ color: colors.muted }}>
            {filteredClients.length} cliente{filteredClients.length !== 1 ? "s" : ""}
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
            placeholder="Buscar por nome, telefone ou email"
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

        {/* New Client Button */}
        <Button
          variant="primary"
          size="medium"
          style={{ marginBottom: 16 }}
          onPress={() => handleOpenModal()}
          disabled={isCreating}
        >
          + Novo Cliente
        </Button>

        {/* Clients List */}
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <View key={client.id}>{renderClientCard(client)}</View>
          ))
        ) : (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <MaterialIcons name="people" size={48} color={colors.muted} />
            <ThemedText style={{ marginTop: 12, color: colors.muted }}>
              {searchQuery ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}
            </ThemedText>
          </View>
        )}
      </ScrollView>

      {/* Client Modal */}
      <ClientModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSave={selectedClient ? handleUpdateClient : handleCreateClient}
        initialData={selectedClient}
        isLoading={isCreating || isUpdating}
      />
    </ScreenContainer>
  );
}
