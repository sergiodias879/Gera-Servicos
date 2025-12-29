import { View, Pressable, ActivityIndicator, ScrollView, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useColors } from "@/hooks/use-colors";
import { useSchedules } from "@/hooks/use-schedules";
import { ScheduleModal } from "@/components/modals/schedule-modal";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState, useMemo } from "react";

const getStatusColor = (type: string) => {
  switch (type) {
    case "service":
      return "#0066CC";
    case "meeting":
      return "#FF9500";
    case "break":
      return "#00B050";
    default:
      return "#666666";
  }
};

const getStatusLabel = (type: string) => {
  switch (type) {
    case "service":
      return "Serviço";
    case "meeting":
      return "Reunião";
    case "break":
      return "Pausa";
    default:
      return "Outro";
  }
};

export default function ScheduleScreen() {
  const colors = useColors();
  const { schedules, isLoadingSchedules, createSchedule, updateSchedule, deleteSchedule, isCreating, isUpdating, isDeleting } = useSchedules();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);

  const uniqueDates = useMemo(() => {
    const dates = new Set<string>();
    schedules.forEach((s) => {
      const date = new Date(s.startDate).toISOString().split("T")[0];
      dates.add(date);
    });
    return Array.from(dates).sort();
  }, [schedules]);

  const schedulesForDate = useMemo(() => {
    return schedules.filter((s) => {
      const date = new Date(s.startDate).toISOString().split("T")[0];
      return date === selectedDate;
    }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [schedules, selectedDate]);

  const handleCreateSchedule = async (data: any) => {
    await createSchedule(data);
  };

  const handleUpdateSchedule = async (data: any) => {
    if (selectedSchedule) {
      await updateSchedule({ id: selectedSchedule.id, ...data });
    }
  };

  const handleDeleteSchedule = async (scheduleId: number) => {
    if (confirm("Tem certeza que deseja deletar este agendamento?")) {
      await deleteSchedule({ id: scheduleId });
    }
  };

  const handleOpenModal = (schedule?: any) => {
    setSelectedSchedule(schedule || null);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedSchedule(null);
  };

  const renderEventCard = (item: any) => {
    const startTime = new Date(item.startDate).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <Card
        key={item.id}
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
            backgroundColor: getStatusColor(item.type),
            borderRadius: 2,
          }}
        />
        <View style={{ flex: 1 }}>
          <ThemedText type="defaultSemiBold" style={{ marginBottom: 4 }}>
            {startTime} - {item.title}
          </ThemedText>
          <ThemedText style={{ fontSize: 12, color: colors.muted }}>
            {getStatusLabel(item.type)}
          </ThemedText>
          {item.location && (
            <ThemedText style={{ fontSize: 11, color: colors.muted, marginTop: 2 }}>
              📍 {item.location}
            </ThemedText>
          )}
        </View>
        <View style={{ flexDirection: "row", gap: 4 }}>
          <Pressable
            onPress={() => handleOpenModal(item)}
            style={{ padding: 8 }}
          >
            <MaterialIcons name="edit" size={18} color={colors.primary} />
          </Pressable>
          <Pressable
            onPress={() => handleDeleteSchedule(item.id)}
            disabled={isDeleting}
            style={{ padding: 8 }}
          >
            <MaterialIcons name="delete" size={18} color="#E74C3C" />
          </Pressable>
        </View>
      </Card>
    );
  };

  if (isLoadingSchedules) {
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
            Agenda
          </ThemedText>
          <ThemedText style={{ color: colors.muted }}>
            {schedulesForDate.length} agendamento{schedulesForDate.length !== 1 ? "s" : ""}
          </ThemedText>
        </View>

        {/* Date Selection */}
        {uniqueDates.length > 0 ? (
          <View style={{ marginBottom: 16 }}>
            <FlatList
              data={uniqueDates}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => setSelectedDate(item)}
                  style={({ pressed }) => [
                    {
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      marginRight: 8,
                      borderRadius: 8,
                      backgroundColor:
                        selectedDate === item ? colors.primary : colors.surface,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <ThemedText
                    style={{
                      color: selectedDate === item ? colors.background : colors.foreground,
                      fontWeight: "600",
                    }}
                  >
                    {new Date(item).toLocaleDateString("pt-BR", {
                      month: "short",
                      day: "numeric",
                    })}
                  </ThemedText>
                </Pressable>
              )}
              keyExtractor={(item) => item}
              horizontal
              scrollEnabled
              showsHorizontalScrollIndicator={false}
            />
          </View>
        ) : null}

        {/* New Schedule Button */}
        <Button
          variant="primary"
          size="medium"
          style={{ marginBottom: 16 }}
          onPress={() => handleOpenModal()}
          disabled={isCreating}
        >
          + Agendar Serviço
        </Button>

        {/* Events List */}
        {schedulesForDate.length > 0 ? (
          <View>
            <ThemedText type="subtitle" style={{ marginBottom: 12 }}>
              Serviços em {new Date(selectedDate).toLocaleDateString("pt-BR")}
            </ThemedText>
            {schedulesForDate.map((event) => renderEventCard(event))}
          </View>
        ) : (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <MaterialIcons name="event-note" size={48} color={colors.muted} />
            <ThemedText style={{ marginTop: 12, color: colors.muted }}>
              Nenhum serviço agendado para esta data
            </ThemedText>
          </View>
        )}
      </ScrollView>

      {/* Schedule Modal */}
      <ScheduleModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSave={selectedSchedule ? handleUpdateSchedule : handleCreateSchedule}
        initialData={selectedSchedule}
        isLoading={isCreating || isUpdating}
      />
    </ScreenContainer>
  );
}
