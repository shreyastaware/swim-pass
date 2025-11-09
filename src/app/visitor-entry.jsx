import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useFonts,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
} from "@expo-google-fonts/montserrat";
import { ArrowRight } from "lucide-react-native";
import { router } from "expo-router";
import { useAppTheme } from "@/utils/theme";

export default function VisitorEntryScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useAppTheme();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [purposeOfVisit, setPurposeOfVisit] = useState("");
  const [whoMeeting, setWhoMeeting] = useState("");
  const [memberType, setMemberType] = useState("");
  const [showPurposeDropdown, setShowPurposeDropdown] = useState(false);

  const [fontsLoaded] = useFonts({
    Montserrat_500Medium,
    Montserrat_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const purposes = ["Swimming", "Gym", "Visit", "Meeting"];
  const memberTypes = ["Monthly", "Yearly", "No (Daily)"];

  const handleNext = () => {
    if (!name || !mobile || !address || !purposeOfVisit || !memberType) {
      alert("Please fill all required fields");
      return;
    }

    if (purposeOfVisit === "Meeting" && !whoMeeting) {
      alert("Please specify who you are meeting");
      return;
    }

    if (mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    router.push({
      pathname: "/photo-capture",
      params: {
        name,
        mobile: "+91" + mobile,
        address,
        purposeOfVisit,
        whoMeeting,
        memberType,
      },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <View
        style={{ paddingTop: insets.top, backgroundColor: colors.background }}
      >
        <View
          style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 }}
        >
          <Text
            style={{
              fontSize: 28,
              fontFamily: "Montserrat_600SemiBold",
              color: colors.primary,
            }}
          >
            Swim Pass
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Montserrat_500Medium",
              color: colors.secondary,
              marginTop: 4,
            }}
          >
            Visitor Entry Form
          </Text>
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
        <Text
          style={{
            fontSize: 12,
            fontFamily: "Montserrat_500Medium",
            color: colors.secondary,
            marginBottom: 8,
          }}
        >
          Name *
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
            marginBottom: 20,
          }}
          placeholder="Enter your full name"
          placeholderTextColor={colors.placeholder}
          value={name}
          onChangeText={setName}
        />

        <Text
          style={{
            fontSize: 12,
            fontFamily: "Montserrat_500Medium",
            color: colors.secondary,
            marginBottom: 8,
          }}
        >
          Mobile Number *
        </Text>
        <View style={{ flexDirection: "row", marginBottom: 20 }}>
          <View
            style={{
              backgroundColor: colors.surfaceVariant,
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 14,
              marginRight: 12,
              borderWidth: 1,
              borderColor: colors.borderLight,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Montserrat_600SemiBold",
                color: colors.primary,
              }}
            >
              +91
            </Text>
          </View>
          <TextInput
            style={{
              flex: 1,
              backgroundColor: colors.surface,
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 14,
              fontSize: 14,
              fontFamily: "Montserrat_500Medium",
              color: colors.primary,
              borderWidth: 1,
              borderColor: colors.borderLight,
            }}
            placeholder="10-digit mobile number"
            placeholderTextColor={colors.placeholder}
            keyboardType="phone-pad"
            maxLength={10}
            value={mobile}
            onChangeText={setMobile}
          />
        </View>

        <Text
          style={{
            fontSize: 12,
            fontFamily: "Montserrat_500Medium",
            color: colors.secondary,
            marginBottom: 8,
          }}
        >
          Address *
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
            marginBottom: 20,
            minHeight: 80,
            textAlignVertical: "top",
          }}
          placeholder="Enter your address"
          placeholderTextColor={colors.placeholder}
          multiline
          value={address}
          onChangeText={setAddress}
        />

        <Text
          style={{
            fontSize: 12,
            fontFamily: "Montserrat_500Medium",
            color: colors.secondary,
            marginBottom: 8,
          }}
        >
          Purpose of Visit *
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 14,
            borderWidth: 1,
            borderColor: colors.borderLight,
            marginBottom: 12,
          }}
          onPress={() => setShowPurposeDropdown(!showPurposeDropdown)}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Montserrat_500Medium",
              color: purposeOfVisit ? colors.primary : colors.placeholder,
            }}
          >
            {purposeOfVisit || "Select purpose of visit"}
          </Text>
        </TouchableOpacity>

        {showPurposeDropdown && (
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              padding: 8,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: colors.borderLight,
            }}
          >
            {purposes.map((purpose) => (
              <TouchableOpacity
                key={purpose}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 12,
                  borderRadius: 12,
                  backgroundColor:
                    purposeOfVisit === purpose
                      ? colors.blueLight
                      : "transparent",
                }}
                onPress={() => {
                  setPurposeOfVisit(purpose);
                  setShowPurposeDropdown(false);
                  if (purpose !== "Meeting") {
                    setWhoMeeting("");
                  }
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Montserrat_500Medium",
                    color: colors.primary,
                  }}
                >
                  {purpose}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {purposeOfVisit === "Meeting" && (
          <>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Montserrat_500Medium",
                color: colors.secondary,
                marginBottom: 8,
              }}
            >
              Who are you meeting? *
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
                marginBottom: 20,
              }}
              placeholder="Enter person's name"
              placeholderTextColor={colors.placeholder}
              value={whoMeeting}
              onChangeText={setWhoMeeting}
            />
          </>
        )}

        <Text
          style={{
            fontSize: 12,
            fontFamily: "Montserrat_500Medium",
            color: colors.secondary,
            marginBottom: 12,
          }}
        >
          Member Type *
        </Text>
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 40 }}>
          {memberTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={{
                flex: 1,
                backgroundColor:
                  memberType === type ? colors.blue : colors.surface,
                borderRadius: 16,
                paddingVertical: 12,
                alignItems: "center",
                borderWidth: 1,
                borderColor:
                  memberType === type ? colors.blue : colors.borderLight,
              }}
              onPress={() => setMemberType(type)}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Montserrat_600SemiBold",
                  color:
                    memberType === type
                      ? isDark
                        ? "#000000"
                        : "#FFFFFF"
                      : colors.primary,
                }}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
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
              fontSize: 16,
              fontFamily: "Montserrat_600SemiBold",
              color: isDark ? "#000000" : "#FFFFFF",
              marginRight: 8,
            }}
          >
            Next
          </Text>
          <ArrowRight size={20} color={isDark ? "#000000" : "#FFFFFF"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
