import { View, Pressable, ScrollView, Switch, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";
import { useThemeContext } from "@/lib/theme-provider";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useState } from "react";

const menuItems = [
  {
    id: "profile",
    icon: "person",
    label: "Perfil",
    description: "Editar informações pessoais",
  },
  {
    id: "settings",
    icon: "settings",
    label: "Configurações",
    description: "Preferências do aplicativo",
  },
  {
    id: "reports",
    icon: "assessment",
    label: "Relatórios",
    description: "Visualizar estatísticas",
  },
  {
    id: "support",
    icon: "help",
    label: "Suporte",
    description: "Entrar em contato",
  },
  {
    id: "about",
    icon: "info",
    label: "Sobre",
    description: "Informações do aplicativo",
  },
];

export default function MoreScreen() {
  const colors = useColors();
  const { user, logout, loading: authLoading } = useAuth();
  const { setColorScheme, colorScheme } = useThemeContext();
  const toggleTheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (confirm("Tem certeza que deseja sair?")) {
      try {
        setIsLoggingOut(true);
        await logout();
        router.replace("/oauth/callback");
      } catch (error) {
        console.error("Erro ao fazer logout:", error);
        alert("Erro ao fazer logout");
      } finally {
        setIsLoggingOut(false);
      }
    }
  };

  const handleMenuItemPress = (itemId: string) => {
    console.log("Menu item pressed:", itemId);
  };

  const renderMenuItem = (item: any) => (
    <Pressable
      key={item.id}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
      onPress={() => handleMenuItemPress(item.id)}
    >
      <Card
        style={{
          marginBottom: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 8,
              backgroundColor: `${colors.primary}15`,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialIcons name={item.icon as any} size={24} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText type="defaultSemiBold" style={{ marginBottom: 2 }}>
              {item.label}
            </ThemedText>
            <ThemedText style={{ fontSize: 12, color: colors.muted }}>
              {item.description}
            </ThemedText>
          </View>
        </View>
        <MaterialIcons name="chevron-right" size={24} color={colors.muted} />
      </Card>
    </Pressable>
  );

  if (authLoading) {
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
        <View style={{ marginBottom: 24 }}>
          <ThemedText type="title" style={{ marginBottom: 4 }}>
            Mais
          </ThemedText>
          <ThemedText style={{ color: colors.muted }}>
            Configurações e opções
          </ThemedText>
        </View>

        {/* Profile Card */}
        {user && (
          <Card
            style={{
              marginBottom: 24,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: colors.primary,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ThemedText
                style={{
                  color: colors.background,
                  fontSize: 24,
                  fontWeight: "bold",
                }}
              >
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </ThemedText>
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText type="defaultSemiBold" style={{ marginBottom: 2 }}>
                {user?.name || "Usuário"}
              </ThemedText>
              <ThemedText style={{ fontSize: 12, color: colors.muted }}>
                {user?.email || "sem email"}
              </ThemedText>
              <ThemedText style={{ fontSize: 11, color: colors.muted, marginTop: 4 }}>
                Administrador
              </ThemedText>
            </View>
          </Card>
        )}

        {/* Theme Toggle */}
        <Card
          style={{
            marginBottom: 24,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 8,
                backgroundColor: `${colors.primary}15`,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialIcons
                name={colorScheme === "dark" ? "dark-mode" : "light-mode"}
                size={24}
                color={colors.primary}
              />
            </View>
            <View>
              <ThemedText type="defaultSemiBold">Modo Escuro</ThemedText>
              <ThemedText style={{ fontSize: 12, color: colors.muted }}>
                {colorScheme === "dark" ? "Ativado" : "Desativado"}
              </ThemedText>
            </View>
          </View>
          <Switch
            value={colorScheme === "dark"}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.background}
          />
        </Card>

        {/* Menu Items */}
        <ThemedText type="subtitle" style={{ marginBottom: 12 }}>
          Opções
        </ThemedText>
        {menuItems.map((item) => renderMenuItem(item))}

        {/* Logout Button */}
        <Pressable
          style={({ pressed }) => [
            {
              marginTop: 24,
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 8,
              backgroundColor: "#E74C3C",
              opacity: pressed ? 0.8 : 1,
            },
          ]}
          onPress={handleLogout}
          disabled={isLoggingOut}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {isLoggingOut ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <>
                <MaterialIcons name="logout" size={20} color={colors.background} />
                <ThemedText
                  style={{
                    color: colors.background,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  Sair
                </ThemedText>
              </>
            )}
          </View>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}
