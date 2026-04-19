import { capitalText } from "@/folder/capitalText";
import { formatDate } from "@/folder/formatDate";
import { useLeaseById } from "@/hooks/useFetchLease";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useMemo } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

const LeaseDetails = () => {
  const { id } = useLocalSearchParams();
  const [menuVisible, setMenuVisible] = useState(false);
  const { data, isLoading, isError } = useLeaseById(id as string);

  const leaseDetails = data?.details?.[0];
  const carDetails = leaseDetails?.carDetails?.[0];

  const days = useMemo(() => {
    if (leaseDetails?.startDate && leaseDetails?.endDate) {
      const start = new Date(leaseDetails.startDate).getTime();
      const end = new Date(leaseDetails.endDate).getTime();
      const diff = end - start;
      return Math.max(0, Math.round(diff / (24 * 60 * 60 * 1000)));
    }
    return 0;
  }, [leaseDetails?.startDate, leaseDetails?.endDate]);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#1F305E" />
      </SafeAreaView>
    );
  }

  if (isError || !leaseDetails) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Icon name="alert-circle-outline" size={50} color="#EF4444" />
        <Text style={styles.errorText}>Failed to load lease details</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER: Kept outside ScrollView so it stays fixed at the top */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Icon name="chevron-back" size={24} color="#1F305E" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Lease Details</Text>

        <View style={styles.menuWrapper}>
          <TouchableOpacity
            onPress={() => setMenuVisible((p) => !p)}
            style={styles.backBtn}
          >
            <Icon name="ellipsis-vertical" size={20} color="#1F305E" />
          </TouchableOpacity>

          {menuVisible && (
            <View style={styles.dropdownMenu}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setMenuVisible(false);
                  router.push({
                    pathname: "/screens/Payments/PaymentDetails",
                    params: { id },
                  });
                }}
              >
                <Icon name="receipt-outline" size={18} color="#4B5563" />
                <Text style={styles.dropdownText}>Receipts</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* SCROLLVIEW: Main content area */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScrollBeginDrag={() => setMenuVisible(false)} // Auto-close menu on scroll
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View>
            {/* Status Section */}
            <View style={styles.statusBanner}>
              <Text style={styles.bannerLabel}>Current Status</Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      leaseDetails?.status === "active" ? "#ECFDF5" : "#FEF2F2",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        leaseDetails?.status === "active"
                          ? "#10B981"
                          : "#EF4444",
                    },
                  ]}
                >
                  {capitalText(leaseDetails?.status || "N/A")}
                </Text>
              </View>
            </View>

            {/* Lease Info Card */}
            <View style={styles.card}>
              <Text style={styles.cardHeading}>Lease Summary</Text>
              <InfoRow label="Type" value="Limited Miles Lease" />
              <InfoRow label="Duration" value={`${days} Days`} />
              <InfoRow
                label="Starts"
                value={formatDate(leaseDetails?.startDate)}
              />
              <InfoRow
                label="Expires"
                value={formatDate(leaseDetails?.endDate)}
              />
            </View>

            {/* Car Info Card */}
            <View style={styles.card}>
              <Text style={styles.cardHeading}>Vehicle Information</Text>
              <InfoRow
                label="Car"
                value={`${capitalText(carDetails?.brand)} ${capitalText(carDetails?.modelName)}`}
              />
              <InfoRow
                label="Price/Day"
                value={`$${carDetails?.pricePerDay}`}
              />
              <InfoRow
                label="Allowed Miles"
                value={`${carDetails?.allowedMilleage} mi`}
              />
              <InfoRow
                label="Current Odometer"
                value={`${carDetails?.initialMileage} mi`}
                last
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoRow = ({ label, value, last }: any) => (
  <View style={[styles.infoRow, last && { borderBottomWidth: 0 }]}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  centered: { justifyContent: "center", alignItems: "center", flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    zIndex: 1000,
  },
  headerTitle: { fontSize: RFValue(15), fontFamily: "bold", color: "#1F305E" },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  menuWrapper: { zIndex: 2000 },
  dropdownMenu: {
    position: "absolute",
    top: 45,
    right: 0,
    backgroundColor: "#FFF",
    borderRadius: 12,
    width: 160,
    padding: 8,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10 },
      android: { elevation: 5 },
    }),
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 10,
  },
  dropdownText: {
    fontSize: RFValue(12),
    color: "#374151",
    fontFamily: "medium",
  },
  scrollContent: { padding: 16, flexGrow: 1 },
  statusBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  bannerLabel: { fontSize: RFValue(12), color: "#6B7280", fontFamily: "bold" },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: RFValue(10), fontFamily: "bold" },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  cardHeading: {
    fontSize: RFValue(13),
    fontFamily: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F9FAFB",
  },
  infoLabel: { fontSize: RFValue(12), color: "#6B7280", fontFamily: "medium" },
  infoValue: { fontSize: RFValue(12), color: "#1F2937", fontFamily: "bold" },
  errorText: { marginTop: 12, color: "#1F2937", fontFamily: "bold" },
  retryButton: {
    marginTop: 20,
    backgroundColor: "#1F305E",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  retryText: { color: "#FFF", fontFamily: "bold" },
});

export default LeaseDetails;
