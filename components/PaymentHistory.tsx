import { formatDate } from "@/folder/formatDate";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const { width } = Dimensions.get("window");

type Payment = {
  paymentId: string;
  Reason: string;
  totalAmount: string;
  startDate: string;
  endDate: string;
  status: string;
  _id: string;
};

function PaymentHistory({ item }: { item: Payment }) {
  return (
    <View style={styles.paymentItem}>
      <View style={styles.paymentRow}>
        <Text style={styles.paymentId}>
          {item?.paymentId ? item?.paymentId[0] : "No ID"}
        </Text>
        <Text style={styles.reason}>
          lease created from {formatDate(item.startDate)} to{" "}
          {formatDate(item.endDate)}
        </Text>
        <View style={styles.details}>
          <Text style={styles.date}>{formatDate(item.startDate)}</Text>
          <Text style={styles.amount}>${item.totalAmount}</Text>
          <Text
            style={[
              styles.status,
              item.status === "active"
                ? styles.successStatus
                : styles.unsuccessStatus,
            ]}
          >
            {item.status === "active"
              ? "completed"
              : item.status === "expired"
                ? "completed"
                : ""}
          </Text>
        </View>
      </View>
      <View style={styles.separatorLine} />
    </View>
  );
}

export default PaymentHistory;

const styles = StyleSheet.create({
  separatorLine: {
    borderWidth: 0.2,
    width: "100%",
    borderColor: "#aaaaaaff",
    marginTop: RFValue(20),
  },
  status: {
    fontFamily: "demiBold",
    fontSize: RFValue(7),
    borderRadius: 20,
    paddingVertical: RFValue(2),
    paddingHorizontal: RFValue(8),
    overflow: "hidden",
    marginTop: RFValue(4),
  },
  successStatus: {
    backgroundColor: "#dce1e9ff",
    color: "blue",
  },
  unsuccessStatus: {
    backgroundColor: "#ecddddff",
    color: "red",
  },
  details: {
    width: width * 0.25,
    alignItems: "flex-end",
  },
  date: {
    fontFamily: "demiBold",
    fontSize: RFValue(9),
    color: "#3f3f3fff",
  },
  amount: {
    fontFamily: "demiBold",
    fontSize: RFValue(9),
    color: "red",
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  paymentId: {
    fontFamily: "demiBold",
    fontSize: RFValue(10),
    width: width * 0.25,
    color: "#3f3f3fff",
  },
  reason: {
    fontFamily: "demiBold",
    fontSize: RFValue(10),
    width: width * 0.25,
    marginLeft: 20,
    color: "#3f3f3fff",
  },
  paymentItem: {
    marginBottom: RFValue(15),
  },
});
