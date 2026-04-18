import { formatDate, statusColor } from "@/lib/status";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

function LeaseCard({ item, toggleExpand, isTablet, expandedId }: any) {
  const expanded = expandedId === item._id;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => toggleExpand(item._id)}
      style={[styles.card, isTablet && styles.cardTablet]}
    >
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.unitText}>
            {item.carDetails?.[0]?.modelName?.charAt(0).toUpperCase() +
              item.carDetails?.[0]?.modelName?.slice(1)}
          </Text>
          <Text style={styles.tenantText}>
            {item.carDetails?.[0]?.brand?.charAt(0).toUpperCase() +
              item.carDetails?.[0]?.brand?.slice(1)}
          </Text>
        </View>
        <View style={styles.metaCol}>
          <Text style={styles.rentText}>
            ${item.totalAmount.toLocaleString()}
          </Text>
          <View
            style={[
              styles.statusPill,
              { backgroundColor: statusColor(item.status) },
            ]}
          >
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.dateRow}>
          <Text style={styles.small}>Start: {formatDate(item.startDate)}</Text>
          <Text style={styles.small}>End: {formatDate(item.endDate)}</Text>
        </View>

        {expanded && (
          <View style={styles.expandedArea}>
            <Text style={styles.notes}>{item.notes}</Text>
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() =>
                  item.status === "active"
                    ? router.push({
                        pathname: "/screens/Lease/ExtendLease",
                        params: { id: item?._id },
                      })
                    : item.status === "expired"
                      ? router.push({
                          pathname: "/screens/Others/DateAndTime",
                          params: { carId: item.car },
                        })
                      : ""
                }
              >
                <Text style={styles.primaryBtnText}>
                  {item?.status === "active"
                    ? "Extend"
                    : item?.status === "expired"
                      ? "Renew"
                      : "No action"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() =>
                  router.push({
                    pathname: "/screens/Lease/LeaseDetails",
                    params: { id: item._id },
                  })
                }
              >
                <Text style={styles.secondaryBtnText}>Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default LeaseCard;

const styles = StyleSheet.create({
  secondaryBtnText: { color: "#111827", fontWeight: "600" },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  primaryBtnText: { color: "#fff", fontWeight: "600" },
  expandedArea: { marginTop: 12 },
  notes: { fontSize: 13, color: "#374151", marginBottom: 12 },

  actionsRow: { flexDirection: "row", justifyContent: "flex-end", gap: 12 },
  primaryBtn: {
    backgroundColor: "#0ea5e9",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cardBody: { borderTopWidth: 1, borderTopColor: "#f3f4f6", paddingTop: 8 },
  dateRow: { flexDirection: "row", justifyContent: "space-between" },
  small: { fontSize: 13, color: "#3f3f3fff", fontFamily: "demiBold" },
  metaCol: { alignItems: "flex-end" },
  rentText: { fontWeight: "700", fontSize: 15, color: "#3f3f3fff" },
  statusPill: {
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: { color: "#fff", fontSize: 11, fontWeight: "700" },

  cardTablet: { marginHorizontal: 6, minWidth: "48%" },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  unitText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3f3f3fff",
    fontFamily: "bold",
  },
  tenantText: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
    fontFamily: "demiBold",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    flex: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
});
