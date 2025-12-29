import { View, Modal, Pressable, TextInput, ScrollView, ActivityIndicator, FlatList } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { useColors } from "@/hooks/use-colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { useClients } from "@/hooks/use-clients";

interface OrderModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    clientId: number;
    title: string;
    description?: string;
    address: string;
    status?: string;
    scheduledDate?: Date;
    scheduledTime?: string;
    value?: number;
    notes?: string;
  }) => Promise<void>;
  initialData?: any;
  isLoading?: boolean;
}

export function OrderModal({
  visible,
  onClose,
  onSave,
  initialData,
  isLoading = false,
}: OrderModalProps) {
  const colors = useColors();
  const { clients } = useClients();
  const [clientId, setClientId] = useState(initialData?.clientId || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [address, setAddress] = useState(initialData?.address || "");
  const [status, setStatus] = useState(initialData?.status || "pending");
  const [scheduledTime, setScheduledTime] = useState(initialData?.scheduledTime || "");
  const [value, setValue] = useState(initialData?.value ? String(initialData.value) : "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [showClientList, setShowClientList] = useState(false);

  const selectedClient = clients.find((c) => c.id === Number(clientId));

  const handleSave = async () => {
    if (!clientId || !title.trim() || !address.trim()) {
      alert("Cliente, título e endereço são obrigatórios");
      return;
    }

    try {
      await onSave({
        clientId: Number(clientId),
        title: title.trim(),
        description: description.trim() || undefined,
        address: address.trim(),
        status: status || "pending",
        scheduledTime: scheduledTime.trim() || undefined,
        value: value ? Number(value) : undefined,
        notes: notes.trim() || undefined,
      });
      resetForm();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar ordem:", error);
      alert("Erro ao salvar ordem");
    }
  };

  const resetForm = () => {
    setClientId("");
    setTitle("");
    setDescription("");
    setAddress("");
    setStatus("pending");
    setScheduledTime("");
    setValue("");
    setNotes("");
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
              {initialData ? "Editar Ordem" : "Nova Ordem"}
            </ThemedText>
            <Pressable onPress={handleClose} disabled={isLoading}>
              <MaterialIcons name="close" size={24} color={colors.foreground} />
            </Pressable>
          </View>

          {/* Form */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Client Selection */}
            <View style={{ marginBottom: 16 }}>
              <ThemedText style={{ marginBottom: 8, fontWeight: "600" }}>
                Cliente *
              </ThemedText>
              <Pressable
                onPress={() => setShowClientList(!showClientList)}
                disabled={isLoading}
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  backgroundColor: colors.surface,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <ThemedText
                  style={{
                    color: selectedClient ? colors.foreground : colors.muted,
                  }}
                >
                  {selectedClient ? selectedClient.name : "Selecionar cliente"}
                </ThemedText>
                <MaterialIcons
                  name={showClientList ? "expand-less" : "expand-more"}
                  size={20}
                  color={colors.muted}
                />
              </Pressable>

              {showClientList && (
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderTopWidth: 0,
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,
                    backgroundColor: colors.surface,
                    maxHeight: 200,
                  }}
                >
                  <FlatList
                    data={clients}
                    renderItem={({ item }) => (
                      <Pressable
                        onPress={() => {
                          setClientId(String(item.id));
                          setShowClientList(false);
                        }}
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 10,
                          borderBottomWidth: 1,
                          borderBottomColor: colors.border,
                        }}
                      >
                        <ThemedText>{item.name}</ThemedText>
                      </Pressable>
                    )}
                    keyExtractor={(item) => String(item.id)}
                    scrollEnabled
                  />
                </View>
              )}
            </View>

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
                placeholder="Detalhes do serviço..."
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

            {/* Address */}
            <View style={{ marginBottom: 16 }}>
              <ThemedText style={{ marginBottom: 8, fontWeight: "600" }}>
                Endereço *
              </ThemedText>
              <TextInput
                placeholder="Rua, número, bairro"
                placeholderTextColor={colors.muted}
                value={address}
                onChangeText={setAddress}
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

            {/* Time */}
            <View style={{ marginBottom: 16 }}>
              <ThemedText style={{ marginBottom: 8, fontWeight: "600" }}>
                Horário
              </ThemedText>
              <TextInput
                placeholder="10:00"
                placeholderTextColor={colors.muted}
                value={scheduledTime}
                onChangeText={setScheduledTime}
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

            {/* Value */}
            <View style={{ marginBottom: 16 }}>
              <ThemedText style={{ marginBottom: 8, fontWeight: "600" }}>
                Valor (R$)
              </ThemedText>
              <TextInput
                placeholder="150.00"
                placeholderTextColor={colors.muted}
                value={value}
                onChangeText={setValue}
                editable={!isLoading}
                keyboardType="decimal-pad"
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

            {/* Status */}
            <View style={{ marginBottom: 16 }}>
              <ThemedText style={{ marginBottom: 8, fontWeight: "600" }}>
                Status
              </ThemedText>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {["pending", "in_progress", "completed"].map((s) => (
                  <Pressable
                    key={s}
                    onPress={() => setStatus(s)}
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      paddingHorizontal: 8,
                      borderRadius: 8,
                      backgroundColor:
                        status === s ? colors.primary : colors.surface,
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}
                  >
                    <ThemedText
                      style={{
                        textAlign: "center",
                        color:
                          status === s ? colors.background : colors.foreground,
                        fontSize: 12,
                      }}
                    >
                      {s === "pending"
                        ? "Pendente"
                        : s === "in_progress"
                          ? "Progresso"
                          : "Concluída"}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Notes */}
            <View style={{ marginBottom: 20 }}>
              <ThemedText style={{ marginBottom: 8, fontWeight: "600" }}>
                Observações
              </ThemedText>
              <TextInput
                placeholder="Notas adicionais..."
                placeholderTextColor={colors.muted}
                value={notes}
                onChangeText={setNotes}
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
