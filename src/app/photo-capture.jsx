import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useFonts,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
} from "@expo-google-fonts/montserrat";
import { Camera, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useAppTheme } from "@/utils/theme";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function PhotoCaptureScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useAppTheme();
  const params = useLocalSearchParams();
  const cameraRef = useRef(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [facing, setFacing] = useState("front");

  const [fontsLoaded] = useFonts({
    Montserrat_500Medium,
    Montserrat_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 40,
        }}
      >
        <StatusBar style={isDark ? "light" : "dark"} />
        <Camera
          size={64}
          color={colors.secondary}
          style={{ marginBottom: 20 }}
        />
        <Text
          style={{
            fontSize: 18,
            fontFamily: "Montserrat_600SemiBold",
            color: colors.primary,
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          Camera Permission Required
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Montserrat_500Medium",
            color: colors.secondary,
            textAlign: "center",
            marginBottom: 32,
          }}
        >
          We need your permission to take a photo for your visitor pass
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: colors.blue,
            borderRadius: 16,
            paddingVertical: 14,
            paddingHorizontal: 32,
          }}
          onPress={requestPermission}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Montserrat_600SemiBold",
              color: isDark ? "#000000" : "#FFFFFF",
            }}
          >
            Grant Permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photoData = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      setPhoto(photoData.uri);
    }
  };

  const retakePicture = () => {
    setPhoto(null);
  };

  const handleNext = () => {
    if (!photo) {
      alert("Please take a photo before continuing");
      return;
    }

    router.push({
      pathname: "/review-submit",
      params: {
        ...params,
        photoUri: photo,
      },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="light" />

      {photo ? (
        <>
          <Image
            source={{ uri: photo }}
            style={{ flex: 1 }}
            resizeMode="cover"
          />

          <View
            style={{
              position: "absolute",
              top: insets.top + 10,
              left: 20,
              right: 20,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(0,0,0,0.5)",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => router.back()}
            >
              <ArrowLeft size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

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
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: colors.surfaceVariant,
                  borderRadius: 16,
                  paddingVertical: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: colors.borderLight,
                }}
                onPress={retakePicture}
              >
                <RotateCcw
                  size={18}
                  color={colors.primary}
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Montserrat_600SemiBold",
                    color: colors.primary,
                  }}
                >
                  Retake
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: colors.blue,
                  borderRadius: 16,
                  paddingVertical: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={handleNext}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Montserrat_600SemiBold",
                    color: isDark ? "#000000" : "#FFFFFF",
                    marginRight: 8,
                  }}
                >
                  Next
                </Text>
                <ArrowRight size={18} color={isDark ? "#000000" : "#FFFFFF"} />
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <>
          <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing} />

          <View
            style={{
              position: "absolute",
              top: insets.top + 10,
              left: 20,
              right: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(0,0,0,0.5)",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => router.back()}
            >
              <ArrowLeft size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 20,
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
              onPress={() => setFacing(facing === "front" ? "back" : "front")}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Montserrat_600SemiBold",
                  color: "#FFFFFF",
                }}
              >
                Flip Camera
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              position: "absolute",
              bottom: insets.bottom + 40,
              left: 0,
              right: 0,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                backgroundColor: "#FFFFFF",
                borderWidth: 4,
                borderColor: "rgba(255,255,255,0.4)",
              }}
              onPress={takePicture}
            />
          </View>
        </>
      )}
    </View>
  );
}
