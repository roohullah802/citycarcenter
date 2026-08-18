import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/utils/Colors";
import { GlobalStyles } from "@/utils/GlobalStyles";
import { capitalText } from "@/folder/capitalText";

interface CountDownProps {
  item: any;
  variant?: "full" | "compact";
}

function calculateTimeLeft(endDateStr: string) {
  if (!endDateStr) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  const end = new Date(endDateStr).getTime();
  if (isNaN(end)) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  const diff = end - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, isExpired: false };
}

const CountDown: React.FC<CountDownProps> = ({ item, variant = "full" }) => {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(item?.endDate));

  useEffect(() => {
    setTimeLeft(calculateTimeLeft(item?.endDate));
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(item?.endDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [item?.endDate]);

  const { days, hours, minutes, isExpired } = timeLeft;

  const pad = (num: number) => String(num).padStart(2, "0");

  // COMPACT VARIANT FOR HOME SCREEN
  if (variant === "compact") {
    return (
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/screens/Lease/LeaseDetails",
            params: { id: item?._id },
          })
        }
        style={({ pressed }) => [
          styles.compactContainer,
          pressed && { opacity: 0.9 },
        ]}
      >
        <View style={styles.compactLeft}>
          <View style={styles.compactIconBox}>
            <Ionicons name="key-outline" size={16} color={Colors.primary} />
          </View>
          <View style={styles.compactTextGroup}>
            <Text style={styles.compactStatus}>Active Lease</Text>
            <Text style={styles.compactCarName} numberOfLines={1}>
              {capitalText(item?.car?.modelName) || "Vehicle"}
            </Text>
          </View>
        </View>

        <View style={styles.compactTimerChip}>
          <Ionicons name="time-outline" size={13} color="#059669" />
          <Text style={styles.compactTimerText}>
            {isExpired ? "Expired" : `${pad(days)}d ${pad(hours)}h ${pad(minutes)}m`}
          </Text>
        </View>
      </Pressable>
    );
  }

  // FULL VARIANT FOR LEASES TAB & DETAILS
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/screens/Lease/LeaseDetails",
          params: { id: item?._id },
        })
      }
      style={({ pressed }) => [
        styles.fullContainer,
        pressed && { opacity: 0.96 },
      ]}
    >
      {/* Top Header Row */}
      <View style={styles.fullHeaderRow}>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusLabel}>
            {isExpired ? "LEASE EXPIRED" : "ACTIVE RENTAL"}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.extendButton}
          activeOpacity={0.8}
          onPress={(e) => {
            e.stopPropagation();
            router.push({
              pathname: "/screens/Lease/ExtendLease",
              params: { id: item?._id },
            });
          }}
        >
          <Ionicons name="add-circle-outline" size={14} color="#FFF" />
          <Text style={styles.extendText}>Extend Lease</Text>
        </TouchableOpacity>
      </View>

      {/* Car Info */}
      <View style={styles.carInfoGroup}>
        <Text style={styles.modelName} numberOfLines={1}>
          {capitalText(item?.car?.modelName) || "PREMIUM CAR"}
        </Text>
        <Text style={styles.brandText} numberOfLines={1}>
          {capitalText(item?.car?.brand) || "Car Center"}
        </Text>
      </View>

      {/* Segmented Timer Component */}
      <View style={styles.timerGrid}>
        <View style={styles.timeSegment}>
          <Text style={styles.timeNumber}>{pad(days)}</Text>
          <Text style={styles.timeLabel}>DAYS</Text>
        </View>

        <Text style={styles.colon}>:</Text>

        <View style={styles.timeSegment}>
          <Text style={styles.timeNumber}>{pad(hours)}</Text>
          <Text style={styles.timeLabel}>HOURS</Text>
        </View>

        <Text style={styles.colon}>:</Text>

        <View style={styles.timeSegment}>
          <Text style={styles.timeNumber}>{pad(minutes)}</Text>
          <Text style={styles.timeLabel}>MINS</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  // FULL VARIANT STYLES
  fullContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "rgba(31, 48, 94, 0.8)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: { elevation: 1 },
    }),
  },
  fullHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
    marginRight: 6,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#059669",
    letterSpacing: 0.5,
  },
  extendButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
  },
  extendText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  carInfoGroup: {
    marginBottom: 16,
  },
  modelName: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.primary,
  },
  brandText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 2,
  },
  timerGrid: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  timeSegment: {
    flex: 1,
    alignItems: "center",
  },
  timeNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.primary,
  },
  timeLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#94A3B8",
    marginTop: 2,
    letterSpacing: 0.5,
  },
  colon: {
    fontSize: 20,
    fontWeight: "800",
    color: "#CBD5E1",
    marginHorizontal: 4,
    bottom: 6,
  },

  // COMPACT VARIANT STYLES FOR HOME SCREEN
  compactContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    ...Platform.select({
      ios: {
        shadowColor: "rgba(31, 48, 94, 0.1)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  compactLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  compactIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#E0F2FE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  compactTextGroup: {
    flex: 1,
  },
  compactStatus: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
    textTransform: "uppercase",
  },
  compactCarName: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.primary,
  },
  compactTimerChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DCFCE7",
    gap: 4,
  },
  compactTimerText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#059669",
  },
});

export default CountDown;
