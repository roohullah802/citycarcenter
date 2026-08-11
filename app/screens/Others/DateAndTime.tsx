import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useStripe } from "@stripe/stripe-react-native";
import { router, useLocalSearchParams } from "expo-router";
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

import { useDocumentStatus } from "@/hooks/useDocuments";
import { useCreateIntent } from "@/hooks/usePayment";
import { useCarById } from "@/hooks/useFetchCars";
import { showToast } from "../../../folder/toastService";

export default function DateAndTimeScreen() {
  const { carId } = useLocalSearchParams<{ carId: string }>();
  const cleanCarId = carId?.replace(/"/g, "") || "";
  const insets = useSafeAreaInsets();
  const { mutateAsync: createIntent, isPending: loading } = useCreateIntent();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  // Fetch car details for price estimation
  const { data: carData } = useCarById(cleanCarId);
  const car = useMemo(() => {
    if (!carData) return null;
    if (Array.isArray(carData.data) && carData.data.length > 0) return carData.data[0];
    if (carData.car) return carData.car;
    if (carData.data && typeof carData.data === 'object') return carData.data;
    return carData;
  }, [carData]);

  // Dates state
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const tomorrow = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 3);
    return d;
  }, [today]);

  const [pickUpDate, setPickUpDate] = useState<Date>(today);
  const [returnDate, setReturnDate] = useState<Date>(tomorrow);

  const [activePicker, setActivePicker] = useState<"pickup" | "return" | null>(null);

  const { data: docData } = useDocumentStatus();
  const currentStatus = docData?.docStatus || "unverified";

  // Calculate total lease days
  const totalDays = useMemo(() => {
    const diffTime = returnDate.getTime() - pickUpDate.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 1;
  }, [pickUpDate, returnDate]);

  // Live estimated price calculation
  const priceEstimation = useMemo(() => {
    if (!car) return { base: 0, discount: 0, tax: 0, total: 0, rateType: "daily" };

    const dailyRate = car.pricePerDay || 0;
    const weeklyRate = car.weeklyRate || dailyRate * 7;
    const monthlyRate = car.monthlyRate || dailyRate * 25;
    const taxPercent = car.tax || 0;
    const discountPercent = car.discountEnabled ? (car.discountPercentage || 0) : 0;

    let base = 0;
    let rateType = "daily";

    if (totalDays >= 28 && monthlyRate > 0) {
      rateType = "monthly";
      const months = Math.floor(totalDays / 30);
      const remAfterMonths = totalDays % 30;
      const weeks = Math.floor(remAfterMonths / 7);
      const remDays = remAfterMonths % 7;
      base = (months * monthlyRate) + (weeks * weeklyRate) + (remDays * dailyRate);
    } else if (totalDays >= 7 && weeklyRate > 0) {
      rateType = "weekly";
      const weeks = Math.floor(totalDays / 7);
      const remDays = totalDays % 7;
      base = (weeks * weeklyRate) + (remDays * dailyRate);
    } else {
      rateType = "daily";
      base = totalDays * dailyRate;
    }

    base = Math.round(base * 100) / 100;
    const discount = Math.round(base * (discountPercent / 100) * 100) / 100;
    const afterDiscount = base - discount;
    const tax = Math.round(afterDiscount * (taxPercent / 100) * 100) / 100;
    const total = Math.round((afterDiscount + tax) * 100) / 100;

    return { base, discount, tax, total, rateType };
  }, [car, totalDays]);

  // Date picker handlers
  const onChangePickUp = useCallback((event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") setActivePicker(null);
    if (selectedDate) {
      setPickUpDate(selectedDate);
      // Ensure return date is strictly after pickup date
      if (returnDate <= selectedDate) {
        const newReturn = new Date(selectedDate);
        newReturn.setDate(newReturn.getDate() + 1);
        setReturnDate(newReturn);
      }
    }
  }, [returnDate]);

  const onChangeReturn = useCallback((event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") setActivePicker(null);
    if (selectedDate) {
      if (selectedDate <= pickUpDate) {
        showToast("Return date must be after pick-up date.");
        return;
      }
      setReturnDate(selectedDate);
    }
  }, [pickUpDate]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const minReturnDate = useMemo(() => {
    const d = new Date(pickUpDate);
    d.setDate(d.getDate() + 1);
    return d;
  }, [pickUpDate]);

  const handlePayment = async () => {
    if (!isSignedIn) return showToast("Please login to continue");
    if (currentStatus === "pending") {
      showToast("Your documents are under review. Please wait for approval.");
      return;
    }
    if (currentStatus !== "approved") {
      showToast("Please upload your documents to rent a car.");
      router.push("/screens/Setting/DocumentUploadScreen");
      return;
    }

    if (returnDate <= pickUpDate) {
      showToast("Return date must be at least 1 day after pick-up date.");
      return;
    }

    try {
      const mongodbId = user?.publicMetadata?.mongodbId;

      if (!mongodbId) throw new Error("User session expired. Please re-login.");

      const resp = await createIntent({
        action: "createLease",
        userId: mongodbId,
        carId: cleanCarId,
        startDate: pickUpDate.toISOString(),
        endDate: returnDate.toISOString(),
        applyDiscount: car?.discountEnabled || false,
      });

      if (!resp?.clientSecret) {
        throw new Error(
          resp?.message || resp?.error || "Payment gateway error",
        );
      }

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

      if (presentError) {
        if (presentError.code === "Canceled") {
          showToast("Payment canceled. No charges were made.");
          return;
        }
        throw presentError;
      }

      router.push("/screens/Payments/PaymentSuccess");
    } catch (error: any) {
      const serverData = error?.response?.data;
      const serverMessage =
        serverData?.message || serverData?.error || serverData;
      let finalMessage =
        serverMessage || error?.message || "Transaction failed";

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
        <Text style={styles.headerTitle}>Select Dates & Duration</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.introSection}>
          <Text style={styles.welcomeText}>Rental Duration</Text>
          <Text style={styles.subText}>
            Choose any start and return dates for your vehicle lease.
          </Text>
        </View>

        {/* Date Selector Card */}
        <View style={styles.mainCard}>
          {/* Pick-Up Date */}
          <TouchableOpacity
            style={styles.dateRow}
            onPress={() => setActivePicker(activePicker === "pickup" ? null : "pickup")}
            activeOpacity={0.6}
          >
            <View style={[styles.iconBox, { backgroundColor: "#E0F2FE" }]}>
              <Ionicons name="calendar-outline" size={22} color="#1F305E" />
            </View>
            <View style={styles.dateInfo}>
              <Text style={styles.dateLabel}>Pick-up Date</Text>
              <Text style={styles.dateText}>{formatDate(pickUpDate)}</Text>
            </View>
            <Ionicons name="pencil-outline" size={18} color="#94A3B8" />
          </TouchableOpacity>

          {activePicker === "pickup" && (
            <View style={styles.pickerContainer}>
              <DateTimePicker
                value={pickUpDate}
                mode="date"
                display={Platform.OS === "ios" ? "inline" : "default"}
                minimumDate={today}
                onChange={onChangePickUp}
              />
              {Platform.OS === "ios" && (
                <TouchableOpacity
                  style={styles.doneBtn}
                  onPress={() => setActivePicker(null)}
                >
                  <Text style={styles.doneBtnText}>Done</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <View style={styles.divider} />

          {/* Return Date */}
          <TouchableOpacity
            style={styles.dateRow}
            onPress={() => setActivePicker(activePicker === "return" ? null : "return")}
            activeOpacity={0.6}
          >
            <View style={[styles.iconBox, { backgroundColor: "#F0FDF4" }]}>
              <Ionicons name="calendar" size={22} color="#059669" />
            </View>
            <View style={styles.dateInfo}>
              <Text style={styles.dateLabel}>Return Date</Text>
              <Text style={styles.dateText}>{formatDate(returnDate)}</Text>
            </View>
            <Ionicons name="pencil-outline" size={18} color="#94A3B8" />
          </TouchableOpacity>

          {activePicker === "return" && (
            <View style={styles.pickerContainer}>
              <DateTimePicker
                value={returnDate}
                mode="date"
                display={Platform.OS === "ios" ? "inline" : "default"}
                minimumDate={minReturnDate}
                onChange={onChangeReturn}
              />
              {Platform.OS === "ios" && (
                <TouchableOpacity
                  style={styles.doneBtn}
                  onPress={() => setActivePicker(null)}
                >
                  <Text style={styles.doneBtnText}>Done</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Duration & Cost Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Price Breakdown</Text>
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>{totalDays} Day{totalDays > 1 ? "s" : ""}</Text>
            </View>
          </View>

          {car && (
            <View style={styles.breakdownRows}>
              <View style={styles.breakdownRow}>
                <Text style={styles.rowLabel}>Rate Tier ({priceEstimation.rateType})</Text>
                <Text style={styles.rowValue}>${priceEstimation.base}</Text>
              </View>

              {priceEstimation.discount > 0 && (
                <View style={styles.breakdownRow}>
                  <Text style={[styles.rowLabel, { color: "#D97706" }]}>Discount ({car.discountPercentage}%)</Text>
                  <Text style={[styles.rowValue, { color: "#D97706" }]}>-${priceEstimation.discount}</Text>
                </View>
              )}

              {priceEstimation.tax > 0 && (
                <View style={styles.breakdownRow}>
                  <Text style={styles.rowLabel}>Tax ({car.tax}%)</Text>
                  <Text style={styles.rowValue}>+${priceEstimation.tax}</Text>
                </View>
              )}

              <View style={[styles.divider, { marginHorizontal: 0, marginVertical: 10 }]} />

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Estimated Price</Text>
                <Text style={styles.totalValue}>${priceEstimation.total}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Insurance Highlight Box */}
        <View style={styles.infoHighlight}>
          <Ionicons name="shield-checkmark" size={20} color="#059669" />
          <Text style={styles.infoHighlightText}>
            Includes full maintenance, insurance coverage, and 24/7 roadside support.
          </Text>
        </View>
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
            <Text style={styles.payBtnText}>
              Confirm Lease (${priceEstimation.total})
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
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
    padding: 20,
  },
  introSection: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1F305E",
  },
  subText: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
  },
  mainCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 8,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "rgba(31, 48, 94, 0.1)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: { elevation: 2 },
    }),
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  dateInfo: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F305E",
  },
  pickerContainer: {
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 16,
    marginHorizontal: 12,
    marginBottom: 12,
  },
  doneBtn: {
    alignSelf: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#1F305E",
    borderRadius: 10,
    marginTop: 8,
  },
  doneBtnText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginHorizontal: 16,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 20,
    marginBottom: 20,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F305E",
  },
  durationBadge: {
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  durationText: {
    color: "#0369A1",
    fontWeight: "800",
    fontSize: 12,
  },
  breakdownRows: {
    gap: 8,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowLabel: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  rowValue: {
    fontSize: 14,
    color: "#1F305E",
    fontWeight: "700",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 4,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1F305E",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#059669",
  },
  infoHighlight: {
    flexDirection: "row",
    backgroundColor: "#F0FDF4",
    padding: 16,
    borderRadius: 16,
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
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    backgroundColor: "#FFF",
  },
  payBtn: {
    backgroundColor: "#1F305E",
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#1F305E",
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
    fontSize: 16,
    fontWeight: "700",
  },
});
