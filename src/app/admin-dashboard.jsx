import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
} from "@expo-google-fonts/montserrat";
import { LogOut, Users, Calendar } from "lucide-react-native";
import { router } from "expo-router";
import { useAppTheme } from "@/utils/theme";

export default function AdminDashboardScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useAppTheme();

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
  });

  const fetchEntries = async () => {
    try {
      const response = await fetch("/api/admin/entries");

      if (!response.ok) {
        throw new Error("Failed to fetch entries");
      }

      const data = await response.json();
      setEntries(data.entries || []);
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEntries();
  };

  const handleLogout = () => {
    router.replace("/admin-login");
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <View
        style={{ paddingTop: insets.top, backgroundColor: colors.background }}
      >
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 28,
                fontFamily: "Montserrat_600SemiBold",
                color: colors.primary,
              }}
            >
              Admin Dashboard
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Montserrat_500Medium",
                color: colors.secondary,
                marginTop: 4,
              }}
            >
              Visitor Entries
            </Text>
          </View>
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.surfaceVariant,
              borderWidth: 1,
              borderColor: colors.borderLight,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={handleLogout}
          >
            <LogOut size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <View
          style={{
            backgroundColor: colors.purple,
            borderRadius: 20,
            padding: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Montserrat_500Medium",
                color: isDark ? "rgba(255,255,255,0.7)" : colors.tertiary,
              }}
            >
              Total Entries
            </Text>
            <Text
              style={{
                fontSize: 32,
                fontFamily: "Montserrat_600SemiBold",
                color: colors.primary,
                marginTop: 4,
              }}
            >
              {entries.length}
            </Text>
          </View>
          <Users size={40} color={colors.primary} />
        </View>
      </View>

      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      ) : entries.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 40,
          }}
        >
          <Users
            size={64}
            color={colors.placeholder}
            style={{ marginBottom: 20 }}
          />
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Montserrat_600SemiBold",
              color: colors.primary,
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            No Entries Yet
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Montserrat_500Medium",
              color: colors.secondary,
              textAlign: "center",
            }}
          >
            Visitor entries will appear here once submitted
          </Text>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 20,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.blue}
            />
          }
        >
          {entries.map((entry, index) => (
            <View
              key={index}
              style={{
                backgroundColor: colors.surface,
                borderRadius: 20,
                padding: 16,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: colors.borderLight,
              }}
            >
              <View style={{ flexDirection: "row", marginBottom: 16 }}>
                <Image
                  source={{ uri: entry.photoUrl }}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    marginRight: 12,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "Montserrat_600SemiBold",
                      color: colors.primary,
                      marginBottom: 4,
                    }}
                  >
                    {entry.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Montserrat_500Medium",
                      color: colors.secondary,
                    }}
                  >
                    {entry.mobile}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 4,
                    }}
                  >
                    <Calendar size={12} color={colors.secondary} />
                    <Text
                      style={{
                        fontSize: 11,
                        fontFamily: "Montserrat_400Regular",
                        color: colors.secondary,
                        marginLeft: 4,
                      }}
                    >
                      {new Date(entry.timestamp).toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>

              <View
                style={{
                  borderTopWidth: 1,
                  borderTopColor: colors.borderLight,
                  paddingTop: 12,
                }}
              >
                <View style={{ flexDirection: "row", marginBottom: 8 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Montserrat_500Medium",
                      color: colors.secondary,
                      width: 100,
                    }}
                  >
                    Address:
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 12,
                      fontFamily: "Montserrat_500Medium",
                      color: colors.primary,
                    }}
                  >
                    {entry.address}
                  </Text>
                </View>

                <View style={{ flexDirection: "row", marginBottom: 8 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Montserrat_500Medium",
                      color: colors.secondary,
                      width: 100,
                    }}
                  >
                    Purpose:
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 12,
                      fontFamily: "Montserrat_500Medium",
                      color: colors.primary,
                    }}
                  >
                    {entry.purposeOfVisit}
                  </Text>
                </View>

                {entry.whoMeeting && (
                  <View style={{ flexDirection: "row", marginBottom: 8 }}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: "Montserrat_500Medium",
                        color: colors.secondary,
                        width: 100,
                      }}
                    >
                      Meeting:
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: 12,
                        fontFamily: "Montserrat_500Medium",
                        color: colors.primary,
                      }}
                    >
                      {entry.whoMeeting}
                    </Text>
                  </View>
                )}

                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Montserrat_500Medium",
                      color: colors.secondary,
                      width: 100,
                    }}
                  >
                    Member:
                  </Text>
                  <View
                    style={{
                      backgroundColor: colors.blueLight,
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontFamily: "Montserrat_600SemiBold",
                        color: colors.primary,
                      }}
                    >
                      {entry.memberType}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
