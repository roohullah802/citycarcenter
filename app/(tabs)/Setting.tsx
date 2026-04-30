import { SettingsRow } from "@/components/SettingsRow";
import { useDocumentStatus } from "@/hooks/useDocuments";
import { statusConfig } from "@/lib/status";
import { Colors } from "@/utils/Colors";
import { GlobalStyles } from "@/utils/GlobalStyles";
import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LogoutModal from "../screens/Auth/Logout";

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
    if (isLoading) return { label: "...", color: Colors.muted, icon: "ellipsis-horizontal" as const };
    if (isError || !data) return { ...statusConfig.unverified, icon: "alert-circle-outline" as const };
    const currentStatus = data?.docStatus || "unverified";
    const config = statusConfig[currentStatus] ?? statusConfig.unverified;

    let icon: keyof typeof Ionicons.glyphMap = "alert-circle-outline";
    if (currentStatus === "approved") icon = "checkmark-circle";
    if (currentStatus === "pending") icon = "time-outline";
    if (currentStatus === "declined") icon = "close-circle-outline";

    return { ...config, icon };
  };

  const { label: badgeLabel, color: badgeColor, icon: badgeIcon } = getBadgeInfo();

  return (
    <View style={GlobalStyles.surface}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 10 },
        ]}
      >
        <Text style={GlobalStyles.headerTitle}>Profile & Settings</Text>

        {/* PREMIUM PROFILE CARD */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <Image source={avatarSource} style={styles.avatar} transition={300} cachePolicy={"memory-disk"} />
          </View>

          <View style={styles.profileDetails}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>
                {user?.fullName ? user.fullName : "Guest User"}
              </Text>
              {isSignedIn && (
                <View style={[styles.statusBadge, { backgroundColor: `${badgeColor}15` }]}>
                  <Ionicons name={badgeIcon} size={12} color={badgeColor} />
                  <Text style={[styles.statusText, { color: badgeColor }]}>{badgeLabel}</Text>
                </View>
              )}
            </View>
            <Text numberOfLines={1} style={styles.email}>
              {isSignedIn
                ? user?.primaryEmailAddress?.emailAddress
                : "Join City Car Center today"}
            </Text>
          </View>

          {!isSignedIn && (
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => router.push("/screens/Auth/SocialAuth")}
            >
              <Ionicons name="log-in-outline" size={20} color={Colors.primary} />
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
                  color={Colors.primary}
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
            <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
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
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    marginBottom: 32,
    ...GlobalStyles.shadowLight,
  },
  avatarWrapper: {
    position: "relative",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    borderRadius: 20,
    padding: 4,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
  },
  profileDetails: { flex: 1, marginLeft: 16 },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  name: { fontSize: 18, fontWeight: "800", color: "rgba(31, 48, 94, 0.88)" },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
    marginLeft: 4,
  },
  statusText: {
    fontSize: 9,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  email: { fontSize: 13, color: "#64748B", marginTop: 4, fontWeight: "500" },
  loginBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F0F9FF",
    justifyContent: "center",
    alignItems: "center",
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
