import PaymentHistory from "@/components/PaymentHistory";
import { usePaymentHistory } from "@/hooks/usePayment";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

const PaymentDetails = () => {
  const { data, isLoading, isError, refetch } = usePaymentHistory();
  const payment = data?.leases;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Professional Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Icon name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment History</Text>
        <TouchableOpacity style={styles.iconBtn} onPress={() => refetch()}>
          <Icon name="reload" size={20} color="#111827" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {isLoading && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#1F305E" />
            <Text style={styles.infoText}>Loading records...</Text>
          </View>
        )}

        {isError && (
          <View style={styles.centerContainer}>
            <View style={styles.errorCircle}>
              <Icon name="cloud-offline" size={32} color="#EF4444" />
            </View>
            <Text style={styles.errorText}>Unable to load history</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => refetch()}
            >
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {!isLoading && !isError && (
          <FlatList
            data={payment}
            renderItem={({ item }) => <PaymentHistory item={item} />}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listPadding}
            ItemSeparatorComponent={() => <View style={styles.itemGap} />}
            ListEmptyComponent={
              <View style={styles.centerContainer}>
                <Icon name="receipt-outline" size={64} color="#E5E7EB" />
                <Text style={styles.noDataText}>No leases found yet</Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default PaymentDetails;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: RFValue(16),
    paddingVertical: RFValue(10),
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  headerTitle: {
    fontFamily: "bold",
    fontSize: RFValue(16),
    color: "#111827",
  },
  content: { flex: 1 },
  listPadding: {
    padding: RFValue(16),
    paddingBottom: RFValue(30),
  },
  itemGap: { height: RFValue(14) },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: RFValue(40),
  },
  infoText: {
    marginTop: RFValue(12),
    fontSize: RFValue(13),
    color: "#6B7280",
    fontFamily: "medium",
  },
  errorCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  errorText: {
    fontSize: RFValue(14),
    color: "#111827",
    fontFamily: "bold",
  },
  retryButton: {
    marginTop: RFValue(16),
    paddingHorizontal: RFValue(24),
    paddingVertical: RFValue(10),
    backgroundColor: "#1F305E",
    borderRadius: 10,
  },
  retryText: { color: "white", fontFamily: "bold", fontSize: RFValue(12) },
  noDataText: {
    fontSize: RFValue(14),
    color: "#9CA3AF",
    fontFamily: "medium",
    marginTop: RFValue(12),
  },
});
