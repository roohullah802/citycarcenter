import CountDown from "@/components/CountDown";
import { useActiveLeases } from "@/hooks/useFetchLease";
import { useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

const AllLeases = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const { data, isLoading, isError, refetch } = useActiveLeases();
  const leases = data?.leases;

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#73C2FB" />
        <Text style={styles.loadingText}>Fetching your leases...</Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <View style={styles.errorIconBg}>
          <Icon name="cloud-offline" size={32} color="#EF4444" />
        </View>
        <Text style={styles.errorTitle}>Connection Error</Text>
        <Text style={styles.message}>
          We couldn&apos;t load your active leases. Please check your internet.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Modern Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="chevron-back" size={24} color="#1F305E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Leases</Text>
        <TouchableOpacity onPress={() => refetch()} style={styles.backBtn}>
          <Icon name="refresh-outline" size={22} color="#1F305E" />
        </TouchableOpacity>
      </View>

      {/* Content Logic */}
      {!isSignedIn || leases?.length === 0 ? (
        <View style={styles.noLeaseContainer}>
          <View style={styles.emptyIconCircle}>
            <Icon name="car-sport-outline" size={50} color="#1F305E" />
          </View>
          <Text style={styles.noLeaseText}>No Active Leases</Text>
          <Text style={styles.message}>
            Rent a car to track your remaining time and lease details here.
          </Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => router.push("/(tabs)/Home")}
          >
            <Text style={styles.browseText}>Browse Cars</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <View style={styles.summaryInfo}>
            <Icon name="time-outline" size={16} color="#6B7280" />
            <Text style={styles.topDescription}>
              You have {leases?.length} active lease
              {leases?.length > 1 ? "s" : ""}
            </Text>
          </View>

          <FlatList
            data={leases || []}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <CountDown item={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listPadding}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default AllLeases;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: RFValue(16),
    fontFamily: "bold",
    color: "#1F305E",
  },
  contentContainer: {
    flex: 1,
  },
  summaryInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 10,
    gap: 6,
  },
  topDescription: {
    color: "#6B7280",
    fontSize: RFValue(13),
    fontFamily: "medium",
  },
  listPadding: {
    padding: 16,
    paddingBottom: 30,
  },
  noLeaseContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  noLeaseText: {
    fontSize: RFValue(18),
    color: "#111827",
    fontFamily: "bold",
    marginBottom: 8,
  },
  loadingText: {
    marginTop: 12,
    fontSize: RFValue(13),
    color: "#6B7280",
    fontFamily: "medium",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  errorIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: RFValue(16),
    fontFamily: "bold",
    color: "#111827",
  },
  message: {
    fontSize: RFValue(12),
    textAlign: "center",
    color: "#6B7280",
    marginTop: 8,
    fontFamily: "medium",
    lineHeight: 18,
  },
  retryButton: {
    marginTop: 24,
    backgroundColor: "#1F305E",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  retryText: {
    color: "#fff",
    fontSize: RFValue(13),
    fontFamily: "bold",
  },
  browseBtn: {
    marginTop: 24,
    borderWidth: 1.5,
    borderColor: "#1F305E",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  browseText: {
    color: "#1F305E",
    fontFamily: "bold",
    fontSize: RFValue(13),
  },
});
