import { router } from "expo-router";
import React, { useMemo } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";

const CountDown = ({ item }: any) => {
  const remainingSeconds = useMemo(() => {
    const end = new Date(item?.endDate).getTime();
    const now = new Date().getTime();
    return Math.max(0, Math.floor((end - now) / 1000));
  }, [item?.endDate]);

  const renderTimerContent = (remainingTime: number) => {
    const days = Math.floor(remainingTime / 86400);
    const hrs = Math.floor((remainingTime % 86400) / 3600);
    const mins = Math.floor((remainingTime % 3600) / 60);

    return (
      <View style={styles.timerInside}>
        <Text style={styles.timerValue}>
          {days > 0 ? `${days}d` : `${hrs}h`}
        </Text>
        <Text style={styles.timerSub}>{days > 0 ? "left" : `${mins}m`}</Text>
      </View>
    );
  };

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/screens/Lease/LeaseDetails",
          params: { id: item?._id },
        })
      }
      style={styles.leaseCard}
    >
      <View style={styles.infoContainer}>
        <View>
          <Text style={styles.statusLabel}>CURRENT LEASE</Text>
          <Text style={styles.modelName} numberOfLines={1}>
            {item?.car.modelName?.toUpperCase() || "CAR MODEL"}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.extendButton}
          onPress={() =>
            router.push({
              pathname: "/screens/Lease/ExtendLease",
              params: { id: item?._id },
            })
          }
        >
          <Text style={styles.extendText}>Extend Lease</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.timerWrapper}>
        <CountdownCircleTimer
          isPlaying
          duration={remainingSeconds}
          colors={["#73C2FB", "#F7B801", "#A30000"]}
          colorsTime={[remainingSeconds, remainingSeconds / 2, 0]}
          size={80}
          strokeWidth={6}
          trailColor="#F0F0F0"
        >
          {({ remainingTime }) => renderTimerContent(remainingTime)}
        </CountdownCircleTimer>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  leaseCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 6,
    marginVertical: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: "#f8f8f8",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  timerWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#73C2FB",
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  modelName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  detailText: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  extendButton: {
    backgroundColor: "#73C2FB15",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#73C2FB",
  },
  extendText: {
    color: "#73C2FB",
    fontSize: 12,
    fontWeight: "700",
  },
  timerInside: {
    alignItems: "center",
  },
  timerValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#333",
  },
  timerSub: {
    fontSize: 10,
    color: "#999",
    fontWeight: "600",
    textTransform: "uppercase",
  },
});

export default CountDown;
