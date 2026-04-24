import { router } from "expo-router";
import React, { useMemo } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { Ionicons } from "@expo/vector-icons";

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
      style={({ pressed }) => [
        styles.leaseCard,
        pressed && { opacity: 0.95, transform: [{ scale: 0.99 }] },
      ]}
    >
      <View style={styles.infoContainer}>
        <View>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusLabel}>ACTIVE RENTAL</Text>
          </View>
          <Text style={styles.modelName} numberOfLines={1}>
            {item?.car?.modelName || "PREMIUM CAR"}
          </Text>
          <View style={styles.brandRow}>
            <Ionicons name="car-sport-outline" size={14} color="#94A3B8" />
            <Text style={styles.brandText} numberOfLines={1}>
              {item?.car?.brand || "Brand"}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.extendButton}
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: "/screens/Lease/ExtendLease",
              params: { id: item?._id },
            })
          }
        >
          <Ionicons name="time-outline" size={14} color="#FFF" />
          <Text style={styles.extendText}>Extend</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.timerWrapper}>
        <CountdownCircleTimer
          isPlaying
          duration={remainingSeconds}
          colors={["#1F305E", "#F59E0B", "#EF4444"]}
          colorsTime={[remainingSeconds, remainingSeconds / 2, 0]}
          size={90}
          strokeWidth={7}
          trailColor="#F1F5F9"
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
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...Platform.select({
      ios: {
        shadowColor: "rgba(31, 48, 94, 0.88)",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingRight: 10,
  },
  timerWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
    marginRight: 4,
  },
  statusLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: "#059669",
    letterSpacing: 0.5,
  },
  modelName: {
    fontSize: 20,
    fontWeight: "800",
    color: "rgba(31, 48, 94, 0.88)",
    marginBottom: 4,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  brandText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#94A3B8",
  },
  extendButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(31, 48, 94, 0.88)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 20,
    gap: 6,
  },
  extendText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  timerInside: {
    alignItems: "center",
  },
  timerValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "rgba(31, 48, 94, 0.88)",
  },
  timerSub: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "700",
    textTransform: "uppercase",
    marginTop: 2,
  },
});

export default CountDown;
