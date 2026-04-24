import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useStripe } from "@stripe/stripe-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth, useUser } from "@clerk/expo";

import { showToast } from "../../../folder/toastService";
import { useCreateIntent } from "@/hooks/usePayment";

export default function DateAndTimeScreen() {
  const { carId } = useLocalSearchParams<{ carId: string }>();
  const insets = useSafeAreaInsets();
  const { mutateAsync: createIntent, isPending: loading } = useCreateIntent();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  // State
  const [pickUpDate, setPickUpDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Constants
  const LEASE_DAYS = 7;

  const returnDate = useMemo(() => {
    const result = new Date(pickUpDate);
    result.setDate(result.getDate() + LEASE_DAYS);
    return result;
  }, [pickUpDate]);

  const onChangeDate = useCallback(
    (event: DateTimePickerEvent, selectedDate?: Date) => {
      if (Platform.OS === "android") setShowDatePicker(false);
      if (selectedDate) setPickUpDate(selectedDate);
    },
    [],
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handlePayment = async () => {
    if (!isSignedIn) return showToast("Please login to continue");

    try {
      const cleanCarId = carId.replace(/"/g, "");
      const mongodbId = user?.publicMetadata?.mongodbId;

      if (!mongodbId) throw new Error("User session expired. Please re-login.");

      const resp = await createIntent({
        action: "createLease",
        userId: mongodbId,
        carId: cleanCarId,
        startDate: pickUpDate.toISOString(),
        endDate: returnDate.toISOString(),
      });

      console.log(resp);

      if (!resp?.clientSecret) throw new Error(resp?.message || resp?.error || "Payment gateway error");

      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: "City Car Center",
        paymentIntentClientSecret: resp.clientSecret,
        appearance: {
          colors: { primary: "#1F305E" },
          shapes: { borderRadius: 12 },
        },
      });

      if (initError) throw initError;

      const { error: presentError } = await presentPaymentSheet();
      if (presentError) throw presentError;

      router.push("/screens/Payments/PaymentSuccess");
    } catch (error: any) {
      const serverData = error?.response?.data;
      const serverMessage = serverData?.message || serverData?.error || serverData;
      let finalMessage = serverMessage || error?.message || "Transaction failed";

      if (Array.isArray(finalMessage)) {
        finalMessage = finalMessage.join(", ");
      } else if (typeof finalMessage === "object") {
        finalMessage = JSON.stringify(finalMessage);
      }

      showToast(String(finalMessage));
    }
  };

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={28} color="#1F305E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lease Duration</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.introSection}>
          <Text style={styles.welcomeText}>Select your dates</Text>
          <Text style={styles.subText}>
            Standard lease duration is {LEASE_DAYS} days.
          </Text>
        </View>

        {/* Date Selector Card */}
        <View style={styles.mainCard}>
          <TouchableOpacity
            style={styles.dateRow}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.6}
          >
            <View style={[styles.iconBox, { backgroundColor: "#E0F2FE" }]}>
              <Ionicons name="calendar" size={22} color="#73C2FB" />
            </View>
            <View style={styles.dateInfo}>
              <Text style={styles.dateLabel}>Pick-up Date</Text>
              <Text style={styles.dateText}>{formatDate(pickUpDate)}</Text>
            </View>
            <Ionicons name="pencil-outline" size={18} color="#CBD5E1" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.dateRow}>
            <View style={[styles.iconBox, { backgroundColor: "#F1F5F9" }]}>
              <Ionicons name="calendar" size={22} color="#64748B" />
            </View>
            <View style={styles.dateInfo}>
              <Text style={styles.dateLabel}>Return Date</Text>
              <Text style={styles.dateText}>{formatDate(returnDate)}</Text>
            </View>
          </View>
        </View>

        {/* Highlight Box */}
        <View style={styles.infoHighlight}>
          <Ionicons name="shield-checkmark" size={20} color="#059669" />
          <Text style={styles.infoHighlightText}>
            Includes full maintenance and roadside assistance.
          </Text>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={pickUpDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            minimumDate={new Date()}
            onChange={onChangeDate}
          />
        )}
      </ScrollView>

      {/* Fixed Footer Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity
          style={[styles.payBtn, loading && styles.payBtnDisabled]}
          onPress={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.payBtnText}>Confirm Lease</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 15,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F305E",
  },
  scrollContent: {
    padding: 24,
  },
  introSection: {
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1F305E",
  },
  subText: {
    fontSize: 15,
    color: "#64748B",
    marginTop: 6,
  },
  mainCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    padding: 8,
    ...Platform.select({
      ios: {
        shadowColor: "rgba(31, 48, 94, 0.88)",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: { elevation: 3 },
    }),
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  dateInfo: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94A3B8",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  dateText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1F305E",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginHorizontal: 16,
  },
  infoHighlight: {
    flexDirection: "row",
    backgroundColor: "#F0FDF4",
    padding: 16,
    borderRadius: 16,
    marginTop: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  infoHighlightText: {
    flex: 1,
    fontSize: 13,
    color: "#166534",
    marginLeft: 10,
    fontWeight: "500",
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  payBtn: {
    backgroundColor: "rgba(31, 48, 94, 0.88)",
    height: 58,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "rgba(31, 48, 94, 0.88)",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: { elevation: 4 },
    }),
  },
  payBtnDisabled: {
    backgroundColor: "#CBD5E1",
    shadowOpacity: 0,
  },
  payBtnText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "700",
  },
});
