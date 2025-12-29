import { View, Modal, Pressable, TextInput, ScrollView, ActivityIndicator } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { useColors } from "@/hooks/use-colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";

interface ClientModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    cpfCnpj?: string;
    notes?: string;
  }) => Promise<void>;
  initialData?: {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    cpfCnpj?: string;
    notes?: string;
  };
  isLoading?: boolean;
}

export function ClientModal({
  visible,
  onClose,
  onSave,
  initialData,
  isLoading = false,
}: ClientModalProps) {
  const colors = useColors();
  const [name, setName] = useState(initialData?.name || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [address, setAddress] = useState(initialData?.address || "");
  const [cpfCnpj, setCpfCnpj] = useState(initialData?.cpfCnpj || "");
  const [notes, setNotes] = useState(initialData?.notes || "");

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Nome do cliente é obrigatório");
      return;
    }

    try {
      await onSave({
        name: name.trim(),
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        address: address.trim() || undefined,
        cpfCnpj: cpfCnpj.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      resetForm();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      alert("Erro ao salvar cliente");
    }
  };

  const resetForm = () => {
    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setCpfCnpj("");
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
              {initialData ? "Editar Cliente" : "Novo Cliente"}
            </ThemedText>
            <Pressable onPress={handleClose} disabled={isLoading}>
              <MaterialIcons name="close" size={24} color={colors.foreground} />
            </Pressable>
          </View>

          {/* Form */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Name */}
            <View style={{ marginBottom: 16 }}>
              <ThemedText style={{ marginBottom: 8, fontWeight: "600" }}>
                Nome *
              </ThemedText>
              <TextInput
                placeholder="Nome do cliente"
                placeholderTextColor={colors.muted}
                value={name}
                onChangeText={setName}
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

            {/* Phone */}
            <View style={{ marginBottom: 16 }}>
              <ThemedText style={{ marginBottom: 8, fontWeight: "600" }}>
                Telefone
              </ThemedText>
              <TextInput
                placeholder="(11) 98765-4321"
                placeholderTextColor={colors.muted}
                value={phone}
                onChangeText={setPhone}
                editable={!isLoading}
                keyboardType="phone-pad"
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

            {/* Email */}
            <View style={{ marginBottom: 16 }}>
              <ThemedText style={{ marginBottom: 8, fontWeight: "600" }}>
                Email
              </ThemedText>
              <TextInput
                placeholder="email@exemplo.com"
                placeholderTextColor={colors.muted}
                value={email}
                onChangeText={setEmail}
                editable={!isLoading}
                keyboardType="email-address"
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

            {/* Address */}
            <View style={{ marginBottom: 16 }}>
              <ThemedText style={{ marginBottom: 8, fontWeight: "600" }}>
                Endereço
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

            {/* CPF/CNPJ */}
            <View style={{ marginBottom: 16 }}>
              <ThemedText style={{ marginBottom: 8, fontWeight: "600" }}>
                CPF/CNPJ
              </ThemedText>
              <TextInput
                placeholder="000.000.000-00"
                placeholderTextColor={colors.muted}
                value={cpfCnpj}
                onChangeText={setCpfCnpj}
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
                numberOfLines={4}
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
