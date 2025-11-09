import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useFonts,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
} from "@expo-google-fonts/montserrat";
import { ArrowLeft, Send } from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useAppTheme } from "@/utils/theme";
import { useUploadToDrive } from "@/utils/useUploadToDrive";

export default function ReviewSubmitScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useAppTheme();
  const params = useLocalSearchParams();
  const [upload] = useUploadToDrive();

  const [submitting, setSubmitting] = useState(false);

  const [fontsLoaded] = useFonts({
    Montserrat_500Medium,
    Montserrat_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const {
    name,
    mobile,
    address,
    purposeOfVisit,
    whoMeeting,
    memberType,
    photoUri,
  } = params;

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      // Upload photo first
      const uploadResult = await upload({
        reactNativeAsset: {
          uri: photoUri,
          name: `visitor-${Date.now()}.jpg`,
          mimeType: "image/jpeg",
        },
      });

      if (uploadResult.error) {
        throw new Error(uploadResult.error);
      }

      // Send data to Google Sheets
      const response = await fetch("/api/visitor-entry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          mobile,
          address,
          purposeOfVisit,
          whoMeeting: whoMeeting || "",
          memberType,
          photoUrl: uploadResult.url,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit visitor entry");
      }

      // Show success alert and navigate back to form
      Alert.alert("Success!", "Visitor entry has been saved successfully", [
        {
          text: "OK",
          onPress: () => router.replace("/visitor-entry"),
        },
      ]);
    } catch (error) {
      console.error("Submission error:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to submit entry. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

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
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.primary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 24,
                fontFamily: "Montserrat_600SemiBold",
                color: colors.primary,
              }}
            >
              Review & Submit
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Montserrat_500Medium",
                color: colors.secondary,
                marginTop: 4,
              }}
            >
              Please verify your information
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 10,
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 20,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: colors.borderLight,
          }}
        >
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Image
              source={{ uri: photoUri }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                marginBottom: 12,
              }}
            />
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Montserrat_600SemiBold",
                color: colors.primary,
              }}
            >
              {name}
            </Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Montserrat_500Medium",
                color: colors.secondary,
                marginBottom: 4,
              }}
            >
              Mobile Number
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Montserrat_600SemiBold",
                color: colors.primary,
              }}
            >
              {mobile}
            </Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Montserrat_500Medium",
                color: colors.secondary,
                marginBottom: 4,
              }}
            >
              Address
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Montserrat_600SemiBold",
                color: colors.primary,
              }}
            >
              {address}
            </Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Montserrat_500Medium",
                color: colors.secondary,
                marginBottom: 4,
              }}
            >
              Purpose of Visit
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Montserrat_600SemiBold",
                color: colors.primary,
              }}
            >
              {purposeOfVisit}
            </Text>
          </View>

          {whoMeeting && (
            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Montserrat_500Medium",
                  color: colors.secondary,
                  marginBottom: 4,
                }}
              >
                Meeting With
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Montserrat_600SemiBold",
                  color: colors.primary,
                }}
              >
                {whoMeeting}
              </Text>
            </View>
          )}

          <View>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Montserrat_500Medium",
                color: colors.secondary,
                marginBottom: 4,
              }}
            >
              Member Type
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Montserrat_600SemiBold",
                color: colors.primary,
              }}
            >
              {memberType}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colors.surface,
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: insets.bottom + 16,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: colors.green,
            borderRadius: 16,
            paddingVertical: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            opacity: submitting ? 0.7 : 1,
          }}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <ActivityIndicator
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
                Uploading to Google Drive...
              </Text>
            </>
          ) : (
            <>
              <Send
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
                Submit to Google Sheets
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
