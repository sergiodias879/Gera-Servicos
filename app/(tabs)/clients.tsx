import { View, FlatList, TextInput, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useColors } from "@/hooks/use-colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";

// Mock data
const mockClients = [
  {
    id: "1",
    name: "João Silva",
    phone: "(11) 98765-4321",
    email: "joao@email.com",
    lastService: "26/12/2024",
    totalServices: 12,
  },
  {
    id: "2",
    name: "Maria Santos",
    phone: "(11) 98765-4322",
    email: "maria@email.com",
    lastService: "25/12/2024",
    totalServices: 8,
  },
  {
    id: "3",
    name: "Pedro Costa",
    phone: "(11) 98765-4323",
    email: "pedro@email.com",
    lastService: "24/12/2024",
    totalServices: 15,
  },
  {
    id: "4",
    name: "Ana Oliveira",
    phone: "(11) 98765-4324",
    email: "ana@email.com",
    lastService: "23/12/2024",
    totalServices: 5,
  },
  {
    id: "5",
    name: "Carlos Mendes",
    phone: "(11) 98765-4325",
    email: "carlos@email.com",
    lastService: "22/12/2024",
    totalServices: 20,
  },
];

export default function ClientsScreen() {
  const colors = useColors();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = mockClients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              {item.totalServices} serviços realizados
            </ThemedText>
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 8 }}>
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
        </View>
        <ThemedText style={{ fontSize: 11, color: colors.muted }}>
          Último serviço: {item.lastService}
        </ThemedText>
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
          Ver Histórico →
        </ThemedText>
      </Pressable>
    </Card>
  );

  return (
    <ScreenContainer className="flex-1">
      {/* Header */}
      <View style={{ marginBottom: 16 }}>
        <ThemedText type="title" style={{ marginBottom: 4 }}>
          Clientes
        </ThemedText>
        <ThemedText style={{ color: colors.muted }}>
          Gerenciar seus clientes
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
        onPress={() => {
          // TODO: Navigate to new client screen
        }}
      >
        + Novo Cliente
      </Button>

      {/* Clients List */}
      <FlatList
        data={filteredClients}
        renderItem={({ item }) => renderClientCard(item)}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <MaterialIcons name="people" size={48} color={colors.muted} />
            <ThemedText style={{ marginTop: 12, color: colors.muted }}>
              Nenhum cliente encontrado
            </ThemedText>
          </View>
        }
      />
    </ScreenContainer>
  );
}
