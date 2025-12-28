import { View, FlatList, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useColors } from "@/hooks/use-colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";

// Mock data
const mockSchedules = [
  {
    id: "1",
    date: "26/12/2024",
    events: [
      { id: "1", time: "10:00", client: "João Silva", status: "in_progress" },
      { id: "2", time: "14:00", client: "Maria Santos", status: "pending" },
      { id: "3", time: "16:00", client: "Pedro Costa", status: "completed" },
    ],
  },
  {
    id: "2",
    date: "27/12/2024",
    events: [
      { id: "4", time: "09:00", client: "Ana Oliveira", status: "pending" },
      { id: "5", time: "11:00", client: "Carlos Mendes", status: "pending" },
    ],
  },
  {
    id: "3",
    date: "28/12/2024",
    events: [
      { id: "6", time: "08:00", client: "Lucia Ferreira", status: "pending" },
    ],
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "#00B050";
    case "in_progress":
      return "#FF9500";
    case "pending":
      return "#0066CC";
    default:
      return "#666666";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "completed":
      return "Concluída";
    case "in_progress":
      return "Em Progresso";
    case "pending":
      return "Pendente";
    default:
      return "Desconhecido";
  }
};

export default function ScheduleScreen() {
  const colors = useColors();
  const [selectedDate, setSelectedDate] = useState("26/12/2024");

  const selectedSchedule = mockSchedules.find((s) => s.date === selectedDate);

  const renderEventCard = (item: any) => (
    <Card
      style={{
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
      }}
    >
      <View
        style={{
          width: 4,
          height: 60,
          backgroundColor: getStatusColor(item.status),
          borderRadius: 2,
        }}
      />
      <View style={{ flex: 1 }}>
        <ThemedText type="defaultSemiBold" style={{ marginBottom: 4 }}>
          {item.time} - {item.client}
        </ThemedText>
        <ThemedText style={{ fontSize: 12, color: colors.muted }}>
          {getStatusLabel(item.status)}
        </ThemedText>
      </View>
      <Pressable style={{ padding: 8 }}>
        <MaterialIcons name="chevron-right" size={24} color={colors.muted} />
      </Pressable>
    </Card>
  );

  return (
    <ScreenContainer className="flex-1">
      {/* Header */}
      <View style={{ marginBottom: 16 }}>
        <ThemedText type="title" style={{ marginBottom: 4 }}>
          Agenda
        </ThemedText>
        <ThemedText style={{ color: colors.muted }}>
          Visualize seus agendamentos
        </ThemedText>
      </View>

      {/* Date Selection */}
      <View style={{ marginBottom: 16 }}>
        <FlatList
          data={mockSchedules}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setSelectedDate(item.date)}
              style={({ pressed }) => [
                {
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  marginRight: 8,
                  borderRadius: 8,
                  backgroundColor:
                    selectedDate === item.date ? colors.primary : colors.surface,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <ThemedText
                style={{
                  color: selectedDate === item.date ? colors.background : colors.foreground,
                  fontWeight: "600",
                }}
              >
                {item.date}
              </ThemedText>
            </Pressable>
          )}
          keyExtractor={(item) => item.id}
          horizontal
          scrollEnabled
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* New Schedule Button */}
      <Button
        variant="primary"
        size="medium"
        style={{ marginBottom: 16 }}
        onPress={() => {
          // TODO: Navigate to new schedule screen
        }}
      >
        + Agendar Serviço
      </Button>

      {/* Events List */}
      {selectedSchedule && selectedSchedule.events.length > 0 ? (
        <View>
          <ThemedText type="subtitle" style={{ marginBottom: 12 }}>
            Serviços em {selectedDate}
          </ThemedText>
          {selectedSchedule.events.map((event) => renderEventCard(event))}
        </View>
      ) : (
        <View style={{ alignItems: "center", paddingVertical: 40 }}>
          <MaterialIcons name="event-note" size={48} color={colors.muted} />
          <ThemedText style={{ marginTop: 12, color: colors.muted }}>
            Nenhum serviço agendado para esta data
          </ThemedText>
        </View>
      )}
    </ScreenContainer>
  );
}
