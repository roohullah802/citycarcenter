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
import { Colors } from "@/utils/Colors";
import { GlobalStyles } from "@/utils/GlobalStyles";

const CountDown = ({ item }: any) => {
  const remainingSeconds = useMemo(() => {
    if (!item?.endDate) return 0;
    const end = new Date(item.endDate).getTime();
    if (isNaN(end)) return 0;
    const now = Date.now();
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
        GlobalStyles.card,
        styles.leaseCardCustom,
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
            <Ionicons name="car-sport-outline" size={14} color={Colors.muted} />
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
          <Ionicons name="time-outline" size={14} color={Colors.white} />
          <Text style={styles.extendText}>Extend</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.timerWrapper}>
        <CountdownCircleTimer
          key={remainingSeconds}
          isPlaying
          duration={remainingSeconds}
          colors={[Colors.primary as any, Colors.warning as any, Colors.danger as any]}
          colorsTime={[remainingSeconds, remainingSeconds / 2, 0]}
          size={90}
          strokeWidth={7}
          trailColor={Colors.border as any}
        >
          {({ remainingTime }) => renderTimerContent(remainingTime)}
        </CountdownCircleTimer>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  leaseCardCustom: {
    flexDirection: "row",
    marginBottom: 16,
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
    backgroundColor: Colors.success,
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
    color: Colors.primary,
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
    color: Colors.muted,
  },
  extendButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 20,
    gap: 6,
  },
  extendText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: "700",
  },
  timerInside: {
    alignItems: "center",
  },
  timerValue: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.primary,
  },
  timerSub: {
    fontSize: 11,
    color: Colors.muted,
    fontWeight: "700",
    textTransform: "uppercase",
    marginTop: 2,
  },
});

export default CountDown;
