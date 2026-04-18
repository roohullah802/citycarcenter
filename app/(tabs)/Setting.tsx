// src/screens/Settings/Settings.tsx
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
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import LogoutModal from "../screens/Auth/Logout";

const { width } = Dimensions.get("window");

const Settings: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useUser();
  const { isSignedIn } = useAuth();

  const handleVisible = useCallback(() => setIsVisible((prev) => !prev), []);

  const avatarSource =
    isSignedIn && user?.imageUrl
      ? { uri: user?.imageUrl }
      : require("../../assests/guest3.png");

  const currentStatus = "pending";

  const { label: badgeLabel, color: badgeColor } =
    statusConfig[currentStatus] ?? statusConfig.notVerified;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.header}>Settings</Text>

        {/* Profile Card */}
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
              {user?.fullName ? user.fullName : "User"}
            </Text>

            {user?.emailAddresses[0] && (
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.email}>
                {user.primaryEmailAddress?.emailAddress || "No Email Address"}
              </Text>
            )}
          </View>

          {!isSignedIn && (
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => {
                router.push("/screens/Auth/SocialAuth");
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.login}>Login</Text>
              <Icon name="log-in-outline" size={26} color="#45B1E8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Documents */}
        {isSignedIn && (
          <View style={styles.card}>
            <SettingsRow
              icon="folder-outline"
              label="Documents"
              onPress={() =>
                router.push("/screens/Setting/DocumentUploadScreen")
              }
            />
          </View>
        )}

        {/* History */}
        {isSignedIn && (
          <>
            <Text style={styles.sectionTitle}>History</Text>
            <View style={styles.card}>
              <SettingsRow
                icon="hourglass-outline"
                label="Lease History"
                onPress={() => router.push("/screens/Lease/LeaseHistory")}
              />
            </View>
          </>
        )}

        {/* Helpful Desk */}
        <Text style={styles.sectionTitle}>Helpful Desk</Text>
        <View style={styles.card}>
          <SettingsRow
            icon="help-circle-outline"
            label="FAQs"
            onPress={() => router.push("/screens/Setting/Faqs")}
          />
          <SettingsRow
            icon="document-text-outline"
            label="Terms & Privacy Policy"
            onPress={() => router.push("/screens/Setting/PrivatePolicy")}
          />
          <SettingsRow
            icon="chatbubble-ellipses-outline"
            label="Report Issue"
            onPress={() => router.push("/screens/Setting/Report")}
          />
        </View>

        {/* Logout */}
        {isSignedIn && (
          <View style={styles.card}>
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
    paddingHorizontal: width * 0.05,
  },
  scrollContent: { paddingBottom: RFValue(40) },
  header: {
    fontSize: RFValue(20),
    fontFamily: "bold",
    color: "#3f3f3fff",
    marginVertical: RFValue(16),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: RFValue(14),
    flexDirection: "row",
    alignItems: "center",
    marginBottom: RFValue(20),
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
  },
  avatar: {
    width: RFValue(56),
    height: RFValue(56),
    borderRadius: RFValue(28),
  },
  badge: {
    position: "absolute",
    bottom: -2,
    right: -4,
    paddingHorizontal: RFValue(6),
    paddingVertical: RFValue(2),
    borderRadius: 6,
  },
  badgeText: {
    color: "#fff",
    fontSize: RFValue(5),
    fontFamily: "bold",
  },
  profileDetails: { flex: 1, marginLeft: RFValue(12) },
  name: { fontSize: RFValue(14), fontFamily: "bold", color: "black" },
  email: { fontSize: RFValue(11), color: "#6B7280", fontFamily: "demiBold" },
  sectionTitle: {
    fontSize: RFValue(12),
    color: "#9CA3AF",
    marginBottom: RFValue(6),
    marginTop: RFValue(12),
    fontFamily: "demiBold",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 1,
    marginBottom: RFValue(14),
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },

  loginButton: { flexDirection: "row", alignItems: "center" },
  login: { fontFamily: "bold", color: "#45B1E8", marginRight: RFValue(6) },
});
