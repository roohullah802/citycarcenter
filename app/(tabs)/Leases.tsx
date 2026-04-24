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
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/utils/Colors";
import { GlobalStyles } from "@/utils/GlobalStyles";

const AllLeases = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const { data, isLoading, isError, refetch } = useActiveLeases();
  const leases = data?.leases;

  if (isLoading) {
    return (
      <View style={[GlobalStyles.surface, GlobalStyles.center]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Fetching your fleet status...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[GlobalStyles.surface, GlobalStyles.center, { paddingHorizontal: 40 }]}>
        <View style={styles.errorIconBox}>
          <Ionicons name="cloud-offline-outline" size={32} color={Colors.danger} />
        </View>
        <Text style={styles.errorTitle}>Connection Interrupted</Text>
        <Text style={styles.errorSubtitle}>
          We couldn&apos;t reach the server. Please check your data connection.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry Connection</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <StatusBar barStyle="dark-content" />

      {/* REFINED HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={28} color={Colors.primary} />
        </TouchableOpacity>

        <Text style={GlobalStyles.headerTitle}>Active Leases</Text>

        <TouchableOpacity onPress={() => refetch()} style={styles.navBtn}>
          <Ionicons name="sync-outline" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* CONTENT LOGIC */}
      {!isSignedIn || leases?.length === 0 ? (
        <View style={styles.emptyWrapper}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="car-sport-outline" size={48} color="#CBD5E1" />
          </View>
          <Text style={styles.emptyTitle}>No Active Rentals</Text>
          <Text style={styles.emptySubtitle}>
            When you lease a car, your timers and rental agreements will appear
            here.
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push("/(tabs)/Home")}
          >
            <Text style={styles.browseButtonText}>Explore Available Cars</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.badgeContainer}>
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>
                {leases?.length} ACTIVE{" "}
                {leases?.length > 1 ? "LEASES" : "LEASE"}
              </Text>
            </View>
          </View>

          <FlatList
            data={leases || []}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <CountDown item={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
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
    backgroundColor: "#FFFFFF",
  },
  centerWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 40,
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
    color: "rgba(31, 48, 94, 0.88)",
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
  },
  badgeContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  activeBadge: {
    backgroundColor: "#F0F9FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0F2FE",
  },
  activeBadgeText: {
    color: "rgba(31, 48, 94, 0.88)",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
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
    color: "rgba(31, 48, 94, 0.88)",
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
  loadingText: {
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
    color: "rgba(31, 48, 94, 0.88)",
  },
  errorSubtitle: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 24,
    backgroundColor: "rgba(31, 48, 94, 0.88)",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
  },
  retryText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  browseButton: {
    marginTop: 28,
    backgroundColor: "#F8FAFC",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#F1F5F9",
  },
  browseButtonText: {
    color: "rgba(31, 48, 94, 0.88)",
    fontWeight: "700",
    fontSize: 14,
  },
});
