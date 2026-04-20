import { router } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const PaymentSuccessScreen: React.FC = () => {
  const handleGoHome = () => {
    router.dismissAll();
    router.replace("/(tabs)/Home");
  };

  const handleViewLease = () => {
    router.dismissAll();
    router.replace("/(tabs)/Leases");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        {/* Success Icon Group */}
        <View style={styles.iconWrapper}>
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle}>
              <Ionicons name="checkmark" size={60} color="#FFF" />
            </View>
          </View>
        </View>

        {/* Text Content */}
        <View style={styles.textGroup}>
          <Text style={styles.title}>Payment Confirmed!</Text>
          <Text style={styles.subtitle}>
            Your lease for the vehicle has been successfully processed. Check
            your email for the rental agreement and pick-up instructions.
          </Text>
        </View>

        {/* Info Card (Clean Professional Aesthetic) */}
        <View style={styles.receiptCard}>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Payment Status</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Completed</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Actions Section */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleViewLease}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>View Lease Tracker</Text>
          <Ionicons
            name="time-outline"
            size={20}
            color="#FFF"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleGoHome}
          activeOpacity={0.6}
        >
          <Text style={styles.secondaryButtonText}>Return to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  iconWrapper: {
    marginBottom: 40,
  },
  outerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(80, 208, 92, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  innerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#50d05c",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#50d05c",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  textGroup: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F305E",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  receiptCard: {
    width: "100%",
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 2,
  },
  receiptLabel: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "500",
  },
  receiptValue: {
    fontSize: 14,
    color: "#1F305E",
    fontWeight: "700",
  },
  statusBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: "#166534",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 14,
    borderStyle: "dashed",
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  primaryButton: {
    backgroundColor: "#1F305E",
    height: 60,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#1F305E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#94A3B8",
    fontSize: 15,
    fontWeight: "600",
  },
});

export default PaymentSuccessScreen;
