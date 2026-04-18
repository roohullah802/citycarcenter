import PaymentHistory from "@/components/PaymentHistory";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

const PaymentDetails: React.FC = () => {
  const { id } = useLocalSearchParams();

  const data = { data: { leases: [] } };
  const payment = data?.data.leases;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Icon name="chevron-back" size={24} color="#1F305E" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Payment Details</Text>
        </View>

        <View>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Payment ID</Text>
            <Text style={[styles.tableHeaderText, { marginRight: 30 }]}>
              Reason
            </Text>
            <Text style={styles.tableHeaderText}>Date</Text>
          </View>

          {!payment || payment?.length === 0 ? (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No payment history</Text>
            </View>
          ) : (
            <FlatList
              data={payment}
              renderItem={({ item }) => <PaymentHistory item={item} />}
              // keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.itemGap} />}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PaymentDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    padding: RFValue(16),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    marginTop: 10,
  },
  backButton: {
    paddingRight: RFValue(10),
  },
  headerText: {
    fontFamily: "bold",
    fontSize: RFValue(16),
    flex: 1,
    textAlign: "center",
    marginRight: RFValue(30),
    color: "#3f3f3fff",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: RFValue(20),
    marginBottom: RFValue(15),
  },
  tableHeaderText: {
    fontFamily: "demiBold",
    fontSize: RFValue(12),
    color: "#3f3f3fff",
  },

  itemGap: {
    height: RFValue(10),
  },
  unSuccessText: {
    color: "red",
  },
  successText: {
    color: "black",
  },
  noDataContainer: {
    alignItems: "center",
    marginTop: RFValue(20),
  },

  noDataText: {
    fontSize: RFValue(12),
    color: "#888",
    fontFamily: "medium",
  },
});
