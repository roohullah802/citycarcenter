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
        <ActivityIndicator size="large" color="#73C2FB" />
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

      {/* REFINED HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={28} color="#1F305E" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Lease Overview</Text>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            onPress={() => setMenuVisible(!menuVisible)}
            style={styles.navBtn}
          >
            <Ionicons name="ellipsis-horizontal" size={22} color="#1F305E" />
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
                <Ionicons name="receipt-outline" size={18} color="#1F305E" />
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
                      leaseDetails?.status === "active" ? "#F0FDF4" : "#FEF2F2",
                  },
                ]}
              >
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        leaseDetails?.status === "active"
                          ? "#22C55E"
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
                          ? "#166534"
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
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color="#73C2FB"
                />
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
                <Ionicons name="car-outline" size={20} color="#73C2FB" />
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
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  centerWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
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
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    zIndex: 1000,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F305E",
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
    backgroundColor: "#FFF",
    borderRadius: 16,
    width: 170,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  dropdownText: { fontSize: 14, color: "#1F305E", fontWeight: "700" },
  scrollContent: { padding: 20, paddingBottom: 40 },
  statusBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  sectionLabel: {
    fontSize: 10,
    color: "#94A3B8",
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 4,
  },
  statusMainText: { fontSize: 16, fontWeight: "700", color: "#1F305E" },
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
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  cardTitle: { fontSize: 16, fontWeight: "800", color: "#1F305E" },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  infoLabel: { fontSize: 14, color: "#94A3B8", fontWeight: "600" },
  infoValue: { fontSize: 14, color: "#1F305E", fontWeight: "700" },
  errorText: {
    fontSize: 16,
    color: "#94A3B8",
    marginTop: 16,
    fontWeight: "600",
  },
  retryButton: {
    marginTop: 24,
    backgroundColor: "#1F305E",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 14,
  },
  retryText: { color: "#FFF", fontWeight: "700" },
});

export default LeaseDetails;
