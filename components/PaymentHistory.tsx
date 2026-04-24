import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/Ionicons";

const statusConfig: any = {
  active: { color: "#10B981", bg: "#ECFDF5", icon: "checkmark-circle" },
  expired: { color: "#EF4444", bg: "#FEF2F2", icon: "alert-circle" },
};

const PaymentHistory = ({ item }: { item: any }) => {
  const config = statusConfig[item.status] || statusConfig.expired;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <View style={styles.card}>
      {/* Header: Car Info & Status */}
      <View style={styles.row}>
        <View style={styles.carSection}>
          <Text style={styles.carModel}>
            {item.car.brand} {item.car.modelName}
          </Text>
          <Text style={styles.paymentId}>PID: {item?.paymentId}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
          <Icon name={config.icon} size={12} color={config.color} />
          <Text style={[styles.statusText, { color: config.color }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Middle: Dates */}
      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Start Date</Text>
          <Text style={styles.detailValue}>{formatDate(item.startDate)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Expiry Date</Text>
          <Text style={styles.detailValue}>{formatDate(item.endDate)}</Text>
        </View>
      </View>

      {/* Footer: Amount */}
      <View style={styles.footer}>
        <Text style={styles.totalLabel}>Total Amount Paid</Text>
        <Text style={styles.amount}>${item.totalAmount.toLocaleString()}</Text>
      </View>
    </View>
  );
};

export default PaymentHistory;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: RFValue(16),
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "rgba(31, 48, 94, 0.88)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  carSection: { flex: 1 },
  carModel: {
    fontSize: RFValue(14),
    fontFamily: "bold",
    color: "rgba(31, 48, 94, 0.88)",
    textTransform: "capitalize",
  },
  paymentId: {
    fontSize: RFValue(10),
    color: "#94A3B8",
    marginTop: 2,
    fontFamily: "medium",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  statusText: { fontSize: RFValue(9), fontFamily: "bold" },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: RFValue(12),
  },
  detailsGrid: { flexDirection: "row", marginBottom: RFValue(12) },
  detailItem: { flex: 1 },
  detailLabel: {
    fontSize: RFValue(10),
    color: "#9CA3AF",
    fontFamily: "medium",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: RFValue(11),
    color: "#374151",
    fontFamily: "demiBold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    marginHorizontal: -RFValue(16),
    marginBottom: -RFValue(16),
    marginTop: RFValue(4),
    padding: RFValue(14),
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  totalLabel: { fontSize: RFValue(11), color: "#64748B", fontFamily: "bold" },
  amount: { fontSize: RFValue(15), color: "rgba(31, 48, 94, 0.88)", fontFamily: "bold" },
});
