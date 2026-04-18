import CountDown from "@/components/CountDown";
import { useAuth } from "@clerk/expo";
import React from "react";
import {
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AllLeases: React.FC = () => {
  const { isSignedIn } = useAuth();
  const LeasesCountDown: [] = [];

  return (
    <SafeAreaView style={styles.container}>
      {Platform.OS === "ios" && <View style={styles.statusBarBackground} />}
      <StatusBar backgroundColor="transparent" barStyle="dark-content" />

      {LeasesCountDown?.length === 0 || !isSignedIn ? (
        <View style={styles.noLeaseContainer}>
          <Text style={styles.noLeaseText}>No Lease Found!</Text>
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <Text style={styles.topText}>Car lease</Text>
          <Text style={styles.topDescription}>
            You have 1 car
            {LeasesCountDown?.length > 1 ? "s" : ""} at lease so far
          </Text>

          <FlatList
            data={LeasesCountDown || []}
            // keyExtractor={(item, index) => item._id || index.toString()}
            renderItem={({ item }) => <CountDown item={item} />}
            showsVerticalScrollIndicator={false}
            extraData={LeasesCountDown}
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
    paddingTop: Platform.OS === "android" ? 20 : 30,
  },
  statusBarBackground: {
    backgroundColor: "white",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  topText: {
    fontSize: 24,
    marginBottom: 4,
    fontFamily: "bold",
    color: "#3f3f3fff",
  },
  topDescription: {
    color: "#3f3f3fff",
    fontSize: 14,
    marginBottom: 20,
    fontFamily: "demiBold",
  },
  leaseCard: {
    width: "100%",
    backgroundColor: "#25262A",
    borderRadius: 15,
    padding: 13,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leaseTitle: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
    fontFamily: "demiBold",
  },
  leaseModel: {
    color: "#ccc",
    fontSize: 12,
    marginTop: 16,
    fontFamily: "demiBold",
  },
  extendButton: {
    backgroundColor: "#fff",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  extendText: {
    fontWeight: "600",
    fontSize: 10,
    fontFamily: "demiBold",
    color: "#3f3f3fff",
  },
  timerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
    paddingHorizontal: 10,
  },
  timerBlock: {
    flex: 1,
    alignItems: "center",
  },
  ti: {
    color: "#fff",
    fontSize: 30,
    marginTop: 10,
    fontFamily: "BebasNeue Regular",
  },
  timerLabel: {
    width: 30,
    fontSize: 11,
    color: "#fff",
    marginTop: 4,
    fontFamily: "demiBold",
    textAlign: "center",
  },
  noLeaseContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  noLeaseText: {
    fontSize: 18,
    color: "gray",
    textAlign: "center",
    fontFamily: "demiBold",
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
    fontWeight: "600",
    marginTop: 10,
    color: "red",
    fontFamily: "bold",
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginTop: 8,
    fontFamily: "medium",
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  retryText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "demiBold",
  },
});
