import { SettingsRow } from "@/components/SettingsRow";
import { statusConfig } from "@/lib/status";
import { useAuth, useUser } from "@clerk/expo";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import LogoutModal from "../screens/Auth/Logout";
import { useDocumentStatus } from "@/hooks/useDocuments";

const { width } = Dimensions.get("window");

const Settings = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useUser();
  const { isSignedIn } = useAuth();

  const { data, isLoading, isError } = useDocumentStatus();

  const handleVisible = useCallback(() => setIsVisible((prev) => !prev), []);

  const avatarSource =
    isSignedIn && user?.imageUrl
      ? { uri: user?.imageUrl }
      : require("../../assests/guest3.png");

  const getBadgeInfo = () => {
    if (isLoading) return { label: "Loading...", color: "#9CA3AF" };
    if (isError || !data) return statusConfig.unverified;

    const currentStatus = data?.docStatus || "unverified";
    return statusConfig[currentStatus] ?? statusConfig.unverified;
  };

  const { label: badgeLabel, color: badgeColor } = getBadgeInfo();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.header}>Settings</Text>

        {/* PROFILE SECTION */}
        <View style={styles.profileCard}>
          <View>
            <Image
              source={avatarSource}
              style={styles.avatar}
              resizeMode="cover"
            />
            {isSignedIn && (
              <View style={[styles.badge, { backgroundColor: badgeColor }]}>
                <Text style={styles.badgeText}>{badgeLabel}</Text>
              </View>
            )}
          </View>

          <View style={styles.profileDetails}>
            <Text style={styles.name}>
              {user?.fullName ? user.fullName : "Guest User"}
            </Text>

            {isSignedIn && user?.primaryEmailAddress ? (
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.email}>
                {user.primaryEmailAddress.emailAddress}
              </Text>
            ) : (
              <Text style={styles.email}>Sign in to manage your account</Text>
            )}
          </View>

          {!isSignedIn && (
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push("/screens/Auth/SocialAuth")}
            >
              <Text style={styles.login}>Login</Text>
              <Icon name="log-in-outline" size={20} color="#45B1E8" />
            </TouchableOpacity>
          )}
        </View>
        {/* Documents */}

        {isSignedIn && (
          <>
            <Text style={styles.sectionTitle}>Documents</Text>
            <View style={styles.card}>
              <SettingsRow
                icon="time-outline"
                label="Documents"
                onPress={() =>
                  router.push("/screens/Setting/DocumentUploadScreen")
                }
              />
            </View>
          </>
        )}

        {/* ACTIVITY HISTORY */}

        {isSignedIn && (
          <>
            <Text style={styles.sectionTitle}>Activity History</Text>
            <View style={styles.card}>
              <SettingsRow
                icon="receipt-outline"
                label="Payment History"
                onPress={() => router.push("/screens/Payments/PaymentDetails")}
              />
            </View>
          </>
        )}

        {/* HELPFUL DESK */}
        <Text style={styles.sectionTitle}>Support & Help</Text>
        <View style={styles.card}>
          <SettingsRow
            icon="help-circle-outline"
            label="FAQs"
            onPress={() => router.push("/screens/Setting/Faqs")}
          />
          <SettingsRow
            icon="shield-checkmark-outline"
            label="Terms & Privacy Policy"
            onPress={() => router.push("/screens/Setting/PrivatePolicy")}
          />
          <SettingsRow
            icon="chatbubble-ellipses-outline"
            label="Report an Issue"
            onPress={() => router.push("/screens/Setting/Report")}
          />
        </View>

        {/* LOGOUT */}
        {isSignedIn && (
          <View style={[styles.card, { marginTop: 10 }]}>
            <SettingsRow
              icon="log-out-outline"
              label="Logout"
              onPress={handleVisible}
            />
          </View>
        )}
      </ScrollView>

      <LogoutModal visible={isVisible} onClose={() => setIsVisible(false)} />
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    paddingHorizontal: width * 0.05,
    paddingBottom: RFValue(40),
  },
  header: {
    fontSize: RFValue(22),
    fontFamily: "bold",
    color: "#111827",
    marginVertical: RFValue(20),
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: RFValue(16),
    flexDirection: "row",
    alignItems: "center",
    marginBottom: RFValue(24),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  avatar: {
    width: RFValue(60),
    height: RFValue(60),
    borderRadius: RFValue(30),
    backgroundColor: "#F3F4F6",
  },
  badge: {
    position: "absolute",
    bottom: -2,
    right: -4,
    paddingHorizontal: RFValue(5),
    paddingVertical: RFValue(3),
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#fff",
  },
  badgeText: {
    color: "#fff",
    fontSize: RFValue(5),
    fontFamily: "bold",
    textTransform: "uppercase",
  },
  profileDetails: { flex: 1, marginLeft: RFValue(16) },
  name: { fontSize: RFValue(16), fontFamily: "bold", color: "#111827" },
  email: {
    fontSize: RFValue(12),
    color: "#6B7280",
    fontFamily: "medium",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: RFValue(11),
    color: "#9CA3AF",
    marginBottom: RFValue(8),
    marginTop: RFValue(14),
    fontFamily: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: RFValue(16),
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F9FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  login: {
    fontFamily: "bold",
    color: "#45B1E8",
    marginRight: RFValue(6),
    fontSize: RFValue(12),
  },
});
