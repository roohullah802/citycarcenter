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
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const PaymentDetails = () => {
  const { data, isLoading, isError, refetch } = usePaymentHistory();
  const payments = data?.leases;

  if (isLoading) {
    return (
      <View style={styles.centerWrapper}>
        <ActivityIndicator size="large" color="#73C2FB" />
        <Text style={styles.statusText}>Retrieving transactions...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerWrapper}>
        <View style={styles.errorIconBox}>
          <Ionicons name="alert-circle-outline" size={32} color="#EF4444" />
        </View>
        <Text style={styles.errorTitle}>Sync Failed</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry Now</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* REFINED HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.navBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#1F305E" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Payment History</Text>

        <TouchableOpacity style={styles.navBtn} onPress={() => refetch()}>
          <Ionicons name="sync-outline" size={22} color="#1F305E" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={payments}
        renderItem={({ item }) => <PaymentHistory item={item} />}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyWrapper}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="receipt-outline" size={42} color="#CBD5E1" />
            </View>
            <Text style={styles.emptyTitle}>No Receipts Found</Text>
            <Text style={styles.emptySubtitle}>
              Your transaction history and lease receipts will appear here after
              your first booking.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default PaymentDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  navBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F305E",
    letterSpacing: -0.5,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  separator: {
    height: 16,
  },
  centerWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 40,
  },
  statusText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: "600",
    color: "#94A3B8",
  },
  errorIconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F305E",
  },
  retryBtn: {
    marginTop: 24,
    backgroundColor: "#1F305E",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
  emptyWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingBottom: 80,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1F305E",
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
    fontWeight: "500",
  },
});
