import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const DocumentsSubmittedScreen: React.FC = () => {
  const router = useRouter();

  const handleGoHome = useCallback(() => {
    // replace ensures the user can't go back to the upload screen
    router.replace("/(tabs)/Home");
  }, [router]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        {/* SUCCESS ICON/IMAGE WRAPPER */}
        <View style={styles.iconWrapper}>
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle}>
              <Image
                source={require("../../../assests/uploadSuccess.jpeg")}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          </View>
          <View style={styles.checkBadge}>
            <Ionicons name="checkmark" size={18} color="#FFF" />
          </View>
        </View>

        {/* TEXT CONTENT */}
        <View style={styles.textGroup}>
          <Text style={styles.title}>Submission Received</Text>
          <Text style={styles.message}>
            Your documents are now being processed by our verification team.
            This usually takes less than 24 hours.
          </Text>
        </View>

        {/* STATUS CARD */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Ionicons name="time-outline" size={20} color="#73C2FB" />
            <Text style={styles.statusLabel}>Verification Status</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>PENDING REVIEW</Text>
          </View>
        </View>
      </View>

      {/* FOOTER BUTTON */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleGoHome}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Continue to Home</Text>
          <Ionicons
            name="arrow-forward"
            size={20}
            color="#FFF"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DocumentsSubmittedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  iconWrapper: {
    marginBottom: 40,
    position: "relative",
  },
  outerCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  innerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    backgroundColor: "#E2E8F0",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  checkBadge: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#10B981",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFF",
  },
  textGroup: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1F305E",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    fontWeight: "500",
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
  },
  statusCard: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#F1F5F9",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1F305E",
  },
  badge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: "800",
    color: "#D97706",
  },
  footer: {
    padding: 24,
  },
  primaryButton: {
    backgroundColor: "#73C2FB",
    height: 60,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1F305E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
