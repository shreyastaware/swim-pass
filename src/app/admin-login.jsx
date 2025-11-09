import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useFonts,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
} from "@expo-google-fonts/montserrat";
import { Lock, LogIn } from "lucide-react-native";
import { router } from "expo-router";
import { useAppTheme } from "@/utils/theme";

export default function AdminLoginScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useAppTheme();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    Montserrat_500Medium,
    Montserrat_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleLogin = () => {
    if (!password) {
      Alert.alert("Error", "Please enter admin password");
      return;
    }

    setLoading(true);

    const ADMIN_PASSWORD = "admin123";

    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        router.replace("/admin-dashboard");
      } else {
        Alert.alert("Error", "Invalid password");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingHorizontal: 20,
          justifyContent: "center",
        }}
      >
        <View style={{ alignItems: "center", marginBottom: 60 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.blueLight,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Lock size={36} color={colors.blue} />
          </View>
          <Text
            style={{
              fontSize: 28,
              fontFamily: "Montserrat_600SemiBold",
              color: colors.primary,
              marginBottom: 8,
            }}
          >
            Admin Access
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Montserrat_500Medium",
              color: colors.secondary,
              textAlign: "center",
            }}
          >
            Enter your password to view visitor entries
          </Text>
        </View>

        <View>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Montserrat_500Medium",
              color: colors.secondary,
              marginBottom: 8,
            }}
          >
            Password
          </Text>
          <TextInput
            style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 14,
              fontSize: 14,
              fontFamily: "Montserrat_500Medium",
              color: colors.primary,
              borderWidth: 1,
              borderColor: colors.borderLight,
              marginBottom: 24,
            }}
            placeholder="Enter admin password"
            placeholderTextColor={colors.placeholder}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={handleLogin}
          />

          <TouchableOpacity
            style={{
              backgroundColor: colors.blue,
              borderRadius: 16,
              paddingVertical: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              opacity: loading ? 0.7 : 1,
            }}
            onPress={handleLogin}
            disabled={loading}
          >
            <LogIn
              size={20}
              color={isDark ? "#000000" : "#FFFFFF"}
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Montserrat_600SemiBold",
                color: isDark ? "#000000" : "#FFFFFF",
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
