import { SettingsRow } from "@/components/SettingsRow";
import { statusConfig } from "@/lib/status";
import { useAuth, useUser } from "@clerk/expo";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import LogoutModal from "../screens/Auth/Logout";
import { useDocumentStatus } from "@/hooks/useDocuments";

const Settings = () => {
  const insets = useSafeAreaInsets();
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
    if (isLoading) return { label: "...", color: "#94A3B8" };
    if (isError || !data) return statusConfig.unverified;
    const currentStatus = data?.docStatus || "unverified";
    return statusConfig[currentStatus] ?? statusConfig.unverified;
  };

  const { label: badgeLabel, color: badgeColor } = getBadgeInfo();

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 10 },
        ]}
      >
        <Text style={styles.header}>Account Settings</Text>

        {/* PROFILE CARD */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <Image source={avatarSource} style={styles.avatar} />
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
            <Text numberOfLines={1} style={styles.email}>
              {isSignedIn
                ? user?.primaryEmailAddress?.emailAddress
                : "Sign in for full access"}
            </Text>
          </View>

          {!isSignedIn && (
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => router.push("/screens/Auth/SocialAuth")}
            >
              <Text style={styles.loginBtnText}>Login</Text>
              <Ionicons name="log-in-outline" size={18} color="rgba(31, 48, 94, 0.88)" />
            </TouchableOpacity>
          )}
        </View>

        {/* --- NEW MANUAL VERIFICATION SECTION --- */}
        {isSignedIn && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Verification</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.manualCard}
              onPress={() =>
                router.push("/screens/Setting/DocumentUploadScreen")
              }
            >
              <View style={styles.iconContainer}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={22}
                  color="rgba(31, 48, 94, 0.88)"
                />
              </View>
              <Text style={styles.cardText}>Identity Documents</Text>
              <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
            </TouchableOpacity>
          </View>
        )}

        {/* ACTIVITY HISTORY */}
        {isSignedIn && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Activity & Transactions</Text>
            <View style={styles.card}>
              <SettingsRow
                icon="receipt-outline"
                label="Billing History"
                onPress={() => router.push("/screens/Payments/PaymentDetails")}
              />
            </View>
          </View>
        )}

        {/* SUPPORT & HELP */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support Center</Text>
          <View style={styles.card}>
            <SettingsRow
              icon="help-circle-outline"
              label="Common FAQs"
              onPress={() => router.push("/screens/Setting/Faqs")}
            />
            <SettingsRow
              icon="shield-checkmark-outline"
              label="Legal & Privacy"
              onPress={() => router.push("/screens/Setting/PrivatePolicy")}
            />
            {isSignedIn && (
              <SettingsRow
                icon="chatbubble-ellipses-outline"
                label="Contact Support"
                onPress={() => router.push("/screens/Setting/Report")}
              />
            )}
          </View>
        </View>

        {/* LOGOUT */}
        {isSignedIn && (
          <TouchableOpacity
            style={styles.logoutWrapper}
            onPress={handleVisible}
          >
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <LogoutModal visible={isVisible} onClose={() => setIsVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  header: {
    fontSize: 26,
    fontWeight: "800",
    color: "rgba(31, 48, 94, 0.88)",
    marginBottom: 24,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    marginBottom: 32,
    ...Platform.select({
      ios: {
        shadowColor: "rgba(31, 48, 94, 0.88)",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: { elevation: 3 },
    }),
  },
  avatarWrapper: { position: "relative" },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "#E2E8F0",
  },
  badge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#F8FAFC",
  },
  badgeText: {
    color: "#FFF",
    fontSize: 5,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  profileDetails: { flex: 1, marginLeft: 16 },
  name: { fontSize: 18, fontWeight: "800", color: "rgba(31, 48, 94, 0.88)" },
  email: { fontSize: 13, color: "#64748B", marginTop: 2, fontWeight: "500" },
  loginBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  loginBtnText: {
    fontWeight: "800",
    color: "rgba(31, 48, 94, 0.88)",
    marginRight: 6,
    fontSize: 13,
  },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 10,
    marginLeft: 4,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "rgba(31, 48, 94, 0.88)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  manualCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    padding: 16,
    height: 64,
    ...Platform.select({
      ios: {
        shadowColor: "rgba(31, 48, 94, 0.88)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardText: { flex: 1, fontSize: 15, fontWeight: "700", color: "rgba(31, 48, 94, 0.88)" },
  logoutWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginTop: 10,
    gap: 8,
  },
  logoutText: { fontSize: 15, fontWeight: "700", color: "#EF4444" },
});

export default Settings;
