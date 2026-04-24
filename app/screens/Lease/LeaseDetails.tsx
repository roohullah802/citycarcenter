import { capitalText } from "@/folder/capitalText";
import { formatDate } from "@/folder/formatDate";
import { useLeaseById } from "@/hooks/useFetchLease";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
  StatusBar,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const LeaseDetails = () => {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [menuVisible, setMenuVisible] = useState(false);
  const { data, isLoading, isError } = useLeaseById(id as string);

  const leaseDetails = data?.details?.[0];
  const carDetails = leaseDetails?.carDetails?.[0];

  const days = useMemo(() => {
    if (leaseDetails?.startDate && leaseDetails?.endDate) {
      const start = new Date(leaseDetails.startDate).getTime();
      const end = new Date(leaseDetails.endDate).getTime();
      return Math.max(0, Math.round((end - start) / (24 * 60 * 60 * 1000)));
    }
    return 0;
  }, [leaseDetails?.startDate, leaseDetails?.endDate]);

  if (isLoading) {
    return (
      <View style={styles.centerWrapper}>
        <ActivityIndicator size="large" color="rgba(31, 48, 94, 0.88)" />
        <Text style={styles.loadingText}>Loading details...</Text>
      </View>
    );
  }

  if (isError || !leaseDetails) {
    return (
      <View style={styles.centerWrapper}>
        <Ionicons name="alert-circle-outline" size={50} color="#EF4444" />
        <Text style={styles.errorText}>Unable to retrieve lease details</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={28} color="rgba(31, 48, 94, 0.88)" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Lease Overview</Text>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            onPress={() => setMenuVisible(!menuVisible)}
            style={styles.navBtn}
          >
            <Ionicons name="ellipsis-horizontal" size={24} color="rgba(31, 48, 94, 0.88)" />
          </TouchableOpacity>

          {menuVisible && (
            <View style={styles.dropdown}>
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
                <Ionicons name="receipt-outline" size={18} color="rgba(31, 48, 94, 0.88)" />
                <Text style={styles.dropdownText}>View Receipt</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScrollBeginDrag={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View>
            {/* STATUS BANNER */}
            <View style={styles.statusBanner}>
              <View>
                <Text style={styles.sectionLabel}>LEASE STATUS</Text>
                <Text style={styles.statusMainText}>
                  Currently {capitalText(leaseDetails?.status)}
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      leaseDetails?.status === "active" ? "#ECFDF5" : "#FEF2F2",
                  },
                ]}
              >
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        leaseDetails?.status === "active"
                          ? "#10B981"
                          : "#EF4444",
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.statusBadgeText,
                    {
                      color:
                        leaseDetails?.status === "active"
                          ? "#065F46"
                          : "#991B1B",
                    },
                  ]}
                >
                  {leaseDetails?.status?.toUpperCase()}
                </Text>
              </View>
            </View>

            {/* LEASE SUMMARY CARD */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconBox}>
                  <Ionicons
                    name="document-text-outline"
                    size={20}
                    color="rgba(31, 48, 94, 0.88)"
                  />
                </View>
                <Text style={styles.cardTitle}>Lease Summary</Text>
              </View>
              <InfoRow label="Contract Type" value="Limited Mileage" />
              <InfoRow label="Total Duration" value={`${days} Days`} />
              <InfoRow
                label="Start Date"
                value={formatDate(leaseDetails?.startDate)}
              />
              <InfoRow
                label="End Date"
                value={formatDate(leaseDetails?.endDate)}
                last
              />
            </View>

            {/* VEHICLE CARD */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconBox}>
                  <Ionicons name="car-outline" size={20} color="rgba(31, 48, 94, 0.88)" />
                </View>
                <Text style={styles.cardTitle}>Vehicle Details</Text>
              </View>
              <InfoRow
                label="Model"
                value={`${capitalText(carDetails?.brand)} ${capitalText(carDetails?.modelName)}`}
              />
              <InfoRow
                label="Daily Rate"
                value={`$${carDetails?.pricePerDay}`}
              />
              <InfoRow
                label="Mile Limit"
                value={`${carDetails?.allowedMilleage} mi`}
              />
              <InfoRow
                label="Starting Odo"
                value={`${carDetails?.initialMileage} mi`}
                last
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>
  );
};

const InfoRow = ({ label, value, last }: any) => (
  <View
    style={[styles.infoRow, last && { borderBottomWidth: 0, paddingBottom: 0 }]}
  >
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  centerWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
    color: "#94A3B8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: "#FFFFFF",
    ...Platform.select({
      ios: {
        shadowColor: "#1F305E",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: { elevation: 3 },
    }),
    zIndex: 1000,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "rgba(31, 48, 94, 0.88)",
    letterSpacing: -0.5,
  },
  navBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: { zIndex: 2000 },
  dropdown: {
    position: "absolute",
    top: 45,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    width: 170,
    padding: 8,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...Platform.select({
      ios: {
        shadowColor: "#1F305E",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: { elevation: 10 },
    }),
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  dropdownText: { fontSize: 14, color: "rgba(31, 48, 94, 0.88)", fontWeight: "700" },
  scrollContent: { padding: 20, paddingBottom: 40 },
  statusBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...Platform.select({
      ios: {
        shadowColor: "#1F305E",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
      },
      android: { elevation: 2 },
    }),
  },
  sectionLabel: {
    fontSize: 10,
    color: "#94A3B8",
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 4,
  },
  statusMainText: { fontSize: 16, fontWeight: "800", color: "rgba(31, 48, 94, 0.88)" },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 8 },
  statusBadgeText: { fontSize: 11, fontWeight: "800" },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...Platform.select({
      ios: {
        shadowColor: "#1F305E",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
      },
      android: { elevation: 2 },
    }),
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  cardTitle: { fontSize: 16, fontWeight: "800", color: "rgba(31, 48, 94, 0.88)" },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  infoLabel: { fontSize: 14, color: "#64748B", fontWeight: "600" },
  infoValue: { fontSize: 14, color: "rgba(31, 48, 94, 0.88)", fontWeight: "800" },
  errorText: {
    fontSize: 16,
    color: "#94A3B8",
    marginTop: 16,
    fontWeight: "600",
  },
  retryButton: {
    marginTop: 24,
    backgroundColor: "rgba(31, 48, 94, 0.88)",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 14,
  },
  retryText: { color: "#FFF", fontWeight: "700" },
});

export default LeaseDetails;
