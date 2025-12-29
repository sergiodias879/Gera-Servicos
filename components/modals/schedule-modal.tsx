import { View, Modal, Pressable, TextInput, ScrollView, ActivityIndicator } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { useColors } from "@/hooks/use-colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";

interface ScheduleModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    description?: string;
    startDate: Date;
    endDate?: Date;
    location?: string;
    type?: string;
    reminderMinutes?: number;
  }) => Promise<void>;
  initialData?: any;
  isLoading?: boolean;
}

export function ScheduleModal({
  visible,
  onClose,
  onSave,
  initialData,
  isLoading = false,
}: ScheduleModalProps) {
  const colors = useColors();
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [date, setDate] = useState(
    initialData?.startDate
      ? new Date(initialData.startDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [startTime, setStartTime] = useState(initialData?.startTime || "09:00");
  const [endTime, setEndTime] = useState(initialData?.endTime || "10:00");
  const [location, setLocation] = useState(initialData?.location || "");
  const [type, setType] = useState(initialData?.type || "service");
  const [reminder, setReminder] = useState(
    String(initialData?.reminderMinutes || 15)
  );

  const handleSave = async () => {
    if (!title.trim() || !date) {
      alert("Título e data são obrigatórios");
      return;
    }

    try {
      const startDate = new Date(`${date}T${startTime}:00`);
      const endDate = new Date(`${date}T${endTime}:00`);

      await onSave({
        title: title.trim(),
        description: description.trim() || undefined,
        startDate,
        endDate,
        location: location.trim() || undefined,
        type: type || "service",
        reminderMinutes: Number(reminder) || 15,
      });
      resetForm();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar agendamento:", error);
      alert("Erro ao salvar agendamento");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    setStartTime("09:00");
    setEndTime("10:00");
    setLocation("");
    setType("service");
    setReminder("15");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
        <View
          style={{
            flex: 1,
            marginTop: 100,
            backgroundColor: colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 20,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <ThemedText type="title">
              {initialData ? "Editar Agendamento" : "Novo Agendamento"}
            </ThemedText>
            <Pressable onPress={handleClose} disabled={isLoading}>
              <MaterialIcons name="close" size={24} color={colors.foreground} />
            </Pressable>
          </View>

          {/* Form */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Title */}
            <View style={{ marginBottom: 16 }}>
              <ThemedText style={{ marginBottom: 8, fontWeight: "600" }}>
                Título *
              </ThemedText>
              <TextInput
                placeholder="Limpeza residencial, etc."
                placeholderTextColor={colors.muted}
                value={title}
                onChangeText={setTitle}
                editable={!isLoading}
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: colors.foreground,
                  backgroundColor: colors.surface,
                }}
              />
            </View>

            {/* Description */}
            <View style={{ marginBottom: 16 }}>
              <ThemedText style={{ marginBottom: 8, fontWeight: "600" }}>
                Descrição
              </ThemedText>
              <TextInput
                placeholder="Detalhes do agendamento..."
                placeholderTextColor={colors.muted}
                value={description}
                onChangeText={setDescription}
                editable={!isLoading}
                multiline
                numberOfLines={3}
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: colors.foreground,
                  backgroundColor: colors.surface,
                  textAlignVertical: "top",
                }}
              />
            </View>

            {/* Date */}
            <View style={{ marginBottom: 16 }}>
              <ThemedText style={{ marginBottom: 8, fontWeight: "600" }}>
                Data *
              </ThemedText>
              <TextInput
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.muted}
                value={date}
                onChangeText={setDate}
                editable={!isLoading}
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: colors.foreground,
                  backgroundColor: colors.surface,
                }}
              />
            </View>

            {/* Time Range */}
            <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
              <View style={{ flex: 1 }}>
                <ThemedText style={{ marginBottom: 8, fontWeight: "600" }}>
                  Início
                </ThemedText>
                <TextInput
                  placeholder="09:00"
                  placeholderTextColor={colors.muted}
                  value={startTime}
                  onChangeText={setStartTime}
                  editable={!isLoading}
                  style={{
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    color: colors.foreground,
                    backgroundColor: colors.surface,
                  }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText style={{ marginBottom: 8, fontWeight: "600" }}>
                  Fim
                </ThemedText>
                <TextInput
                  placeholder="10:00"
                  placeholderTextColor={colors.muted}
                  value={endTime}
                  onChangeText={setEndTime}
                  editable={!isLoading}
                  style={{
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    color: colors.foreground,
                    backgroundColor: colors.surface,
                  }}
                />
              </View>
            </View>

            {/* Location */}
            <View style={{ marginBottom: 16 }}>
              <ThemedText style={{ marginBottom: 8, fontWeight: "600" }}>
                Local
              </ThemedText>
              <TextInput
                placeholder="Endereço ou local..."
                placeholderTextColor={colors.muted}
                value={location}
                onChangeText={setLocation}
                editable={!isLoading}
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: colors.foreground,
                  backgroundColor: colors.surface,
                }}
              />
            </View>

            {/* Type */}
            <View style={{ marginBottom: 16 }}>
              <ThemedText style={{ marginBottom: 8, fontWeight: "600" }}>
                Tipo
              </ThemedText>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {["service", "meeting", "break"].map((t) => (
                  <Pressable
                    key={t}
                    onPress={() => setType(t)}
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      paddingHorizontal: 8,
                      borderRadius: 8,
                      backgroundColor:
                        type === t ? colors.primary : colors.surface,
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}
                  >
                    <ThemedText
                      style={{
                        textAlign: "center",
                        color: type === t ? colors.background : colors.foreground,
                        fontSize: 12,
                      }}
                    >
                      {t === "service"
                        ? "Serviço"
                        : t === "meeting"
                          ? "Reunião"
                          : "Pausa"}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Reminder */}
            <View style={{ marginBottom: 20 }}>
              <ThemedText style={{ marginBottom: 8, fontWeight: "600" }}>
                Lembrete (minutos)
              </ThemedText>
              <TextInput
                placeholder="15"
                placeholderTextColor={colors.muted}
                value={reminder}
                onChangeText={setReminder}
                editable={!isLoading}
                keyboardType="number-pad"
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: colors.foreground,
                  backgroundColor: colors.surface,
                }}
              />
            </View>

            {/* Buttons */}
            <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
              <Button
                variant="secondary"
                size="medium"
                style={{ flex: 1 }}
                onPress={handleClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="medium"
                style={{ flex: 1 }}
                onPress={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.background} />
                ) : (
                  "Salvar"
                )}
              </Button>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
