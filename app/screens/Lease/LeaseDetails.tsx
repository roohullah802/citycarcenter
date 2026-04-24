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
import { Colors } from "@/utils/Colors";
import { GlobalStyles } from "@/utils/GlobalStyles";

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
      <View style={[GlobalStyles.surface, GlobalStyles.center]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading details...</Text>
      </View>
    );
  }

  if (isError || !leaseDetails) {
    return (
      <View style={[GlobalStyles.surface, GlobalStyles.center]}>
        <Ionicons name="alert-circle-outline" size={50} color={Colors.danger} />
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
    <View style={GlobalStyles.surface}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={[GlobalStyles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={28} color={Colors.primary} />
        </TouchableOpacity>

        <Text style={GlobalStyles.headerTitle}>Lease Overview</Text>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            onPress={() => setMenuVisible(!menuVisible)}
            style={styles.navBtn}
          >
            <Ionicons name="ellipsis-horizontal" size={24} color={Colors.primary} />
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
                <Ionicons name="receipt-outline" size={18} color={Colors.primary} />
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
            <View style={[GlobalStyles.card, { marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between' }]}>
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
                          ? Colors.success
                          : Colors.danger,
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
            <View style={[GlobalStyles.card, { marginBottom: 20 }]}>
              <View style={styles.cardHeader}>
                <View style={styles.iconBox}>
                  <Ionicons
                    name="document-text-outline"
                    size={20}
                    color={Colors.primary}
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
                  <Ionicons name="car-outline" size={20} color={Colors.primary} />
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
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
    color: Colors.muted,
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
    backgroundColor: Colors.white,
    borderRadius: 16,
    width: 170,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
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
  dropdownText: { fontSize: 14, color: Colors.primary, fontWeight: "700" },
  scrollContent: { padding: 20, paddingBottom: 40 },
  statusBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
      },
      android: { elevation: 2 },
    }),
  },
  sectionLabel: {
    fontSize: 10,
    color: Colors.muted,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 4,
  },
  statusMainText: { fontSize: 16, fontWeight: "800", color: Colors.primary },
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
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
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
    borderColor: Colors.border,
  },
  cardTitle: { fontSize: 16, fontWeight: "800", color: Colors.primary },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  infoLabel: { fontSize: 14, color: Colors.subtitle, fontWeight: "600" },
  infoValue: { fontSize: 14, color: Colors.primary, fontWeight: "800" },
  errorText: {
    fontSize: 16,
    color: Colors.muted,
    marginTop: 16,
    fontWeight: "600",
  },
  retryButton: {
    marginTop: 24,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 14,
  },
  retryText: { color: Colors.white, fontWeight: "700" },
});

export default LeaseDetails;
