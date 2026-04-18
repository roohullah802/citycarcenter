import CountDown from "@/components/CountDown";
import { useActiveLeases } from "@/hooks/useFetchLease";
import { useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

const AllLeases: React.FC = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const { data, isLoading, isError, refetch } = useActiveLeases();
  const leases = data?.leases;

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#1F305E" />
        <Text style={styles.loadingText}>Fetching your leases...</Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Icon name="cloud-offline-outline" size={60} color="red" />
        <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
        <Text style={styles.message}>
          We couldn&apos;t load your leases. Please check your connection.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {Platform.OS === "ios" && <View style={styles.statusBarBackground} />}
      <StatusBar backgroundColor="transparent" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="chevron-back" size={24} color="#1F305E" />
        </TouchableOpacity>

        <Text style={styles.topText}>Car lease</Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* Content Logic */}
      {!isSignedIn || leases?.length === 0 ? (
        <View style={styles.noLeaseContainer}>
          <Icon name="car-outline" size={80} color="#ccc" />
          <Text style={styles.noLeaseText}>No Active Leases Found!</Text>
          <Text style={styles.message}>
            Rent a car to see your active timers here.
          </Text>
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <Text style={styles.topDescription}>
            You have {leases?.length} car{leases?.length > 1 ? "s" : ""} at
            lease so far
          </Text>

          <FlatList
            data={leases || []}
            keyExtractor={(item) => item._id || Math.random().toString()}
            renderItem={({ item }) => <CountDown item={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
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
    backgroundColor: "#fff",
  },
  statusBarBackground: {
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: Platform.OS === "android" ? 10 : 0,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerSpacer: {
    width: 40,
  },
  topText: {
    fontSize: 20,
    fontFamily: "bold",
    color: "#3f3f3fff",
    textAlign: "center",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  topDescription: {
    color: "#3f3f3fff",
    fontSize: 14,
    marginBottom: 20,
    fontFamily: "demiBold",
    textAlign: "center",
  },
  noLeaseContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    marginTop: -50,
  },
  noLeaseText: {
    fontSize: 18,
    color: "#3f3f3fff",
    textAlign: "center",
    fontFamily: "bold",
    marginTop: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
    fontFamily: "medium",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  errorTitle: {
    fontSize: 18,
    fontFamily: "bold",
    marginTop: 15,
    color: "#333",
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginTop: 8,
    fontFamily: "medium",
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: "#1F305E",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "demiBold",
  },
});
