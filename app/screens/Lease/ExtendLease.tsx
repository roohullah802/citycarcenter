import { showToast } from "@/folder/toastService";
import { useStripe } from "@stripe/stripe-react-native";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useCreateIntent } from "@/hooks/usePayment";
import { useLeaseById } from "@/hooks/useFetchLease";
import { Colors } from "@/utils/Colors";
import { GlobalStyles } from "@/utils/GlobalStyles";
import { useAuth } from "@/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { capitalText } from "@/folder/capitalText";

const ExtendLeaseScreen = () => {
  const { id } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const createIntent = useCreateIntent();
  const { user } = useAuth();

  // Fetch lease details for car rates and current end date
  const { data: leaseData, isLoading: isLeaseLoading } = useLeaseById(id as string);
  const lease = leaseData?.details?.[0] || leaseData?.lease;
  const car = lease?.carDetails?.[0] || lease?.car;

  const [manualDays, setManualDays] = useState<string>("3");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const daysCount = useMemo(() => {
    const parsed = parseInt(manualDays, 10);
    return isNaN(parsed) || parsed < 1 ? 1 : parsed;
  }, [manualDays]);

  // Calculate new end date
  const currentEndDate = useMemo(() => {
    if (!lease?.endDate) return new Date();
    return new Date(lease.endDate);
  }, [lease?.endDate]);

  const newEndDate = useMemo(() => {
    const result = new Date(currentEndDate);
    result.setDate(result.getDate() + daysCount);
    return result;
  }, [currentEndDate, daysCount]);

  // Live Extension Pricing Calculation
  const priceBreakdown = useMemo(() => {
    if (!car) return { base: 0, tax: 0, total: 0, rateType: "daily" };

    const dailyRate = car.pricePerDay || 0;
    const weeklyRate = car.weeklyRate || dailyRate * 7;
    const monthlyRate = car.monthlyRate || dailyRate * 25;
    const taxPercent = car.tax || 0;

    let base = 0;
    let rateType = "daily";

    if (daysCount >= 28 && monthlyRate > 0) {
      rateType = "monthly";
      const months = Math.floor(daysCount / 30);
      const remAfterMonths = daysCount % 30;
      const weeks = Math.floor(remAfterMonths / 7);
      const remDays = remAfterMonths % 7;
      base = (months * monthlyRate) + (weeks * weeklyRate) + (remDays * dailyRate);
    } else if (daysCount >= 7 && weeklyRate > 0) {
      rateType = "weekly";
      const weeks = Math.floor(daysCount / 7);
      const remDays = daysCount % 7;
      base = (weeks * weeklyRate) + (remDays * dailyRate);
    } else {
      rateType = "daily";
      base = daysCount * dailyRate;
    }

    base = Math.round(base * 100) / 100;
    const tax = Math.round(base * (taxPercent / 100) * 100) / 100;
    const total = Math.round((base + tax) * 100) / 100;

    return { base, tax, total, rateType };
  }, [car, daysCount]);

  const handleManualInput = useCallback((text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setManualDays(numericValue);
  }, []);

  const adjustDays = (delta: number) => {
    const current = parseInt(manualDays, 10) || 0;
    const updated = Math.max(1, current + delta);
    setManualDays(String(updated));
  };

  const setPresetDays = (days: number) => {
    setManualDays(String(days));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleContinue = useCallback(async () => {
    if (!daysCount || daysCount < 1) {
      return showToast("Please enter a valid number of days");
    }

    setIsLoading(true);
    try {
      const mongodbId = user?._id;

      if (!mongodbId) throw new Error("User session expired. Please re-login.");

      const result = await createIntent.mutateAsync({
        action: "extendLease",
        userId: mongodbId,
        leaseId: id,
        days: daysCount,
      });

      const clientSecret = result?.clientSecret;
      if (!clientSecret) throw new Error(result?.message || result?.error || "Could not initialize payment");

      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: "City Car Center",
        paymentIntentClientSecret: clientSecret,
        appearance: {
          colors: { primary: Colors.primary },
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

      // Invalidate frontend cache immediately
      queryClient.invalidateQueries({ queryKey: ["leases"] });
      queryClient.invalidateQueries({ queryKey: ["activeLeases"] });
      queryClient.invalidateQueries({ queryKey: ["leaseById"] });

      router.push("/screens/Payments/PaymentSuccess");
    } catch (error: any) {
      // Only toast for non-axios errors (e.g. Stripe, client-side).
      // Axios server errors are already toasted by the interceptor.
      if (!error?.response) {
        const serverData = error?.response?.data;
        const serverMessage = serverData?.message || serverData?.error || serverData;
        let finalMessage = serverMessage || error?.message || "Extension failed";

        if (Array.isArray(finalMessage)) {
          finalMessage = finalMessage.join(", ");
        } else if (typeof finalMessage === "object") {
          finalMessage = JSON.stringify(finalMessage);
        }

        showToast(String(finalMessage));
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    daysCount,
    initPaymentSheet,
    presentPaymentSheet,
    createIntent,
    id,
    user,
    queryClient,
  ]);

  if (isLeaseLoading) {
    return (
      <View style={[GlobalStyles.container, styles.centerWrapper]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Fetching lease details...</Text>
      </View>
    );
  }

  return (
    <View style={GlobalStyles.container}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={[GlobalStyles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={GlobalStyles.headerTitle}>Extend Lease</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: (insets.bottom || 0) + 140 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* VEHICLE BANNER */}
          {car && (
            <View style={styles.vehicleCard}>
              <View style={styles.vehicleIconBox}>
                <Ionicons name="car-sport-outline" size={24} color={Colors.primary} />
              </View>
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleBrand}>{capitalText(car.brand || "")}</Text>
                <Text style={styles.vehicleName}>{capitalText(car.modelName || "")}</Text>
              </View>
            </View>
          )}

          {/* DURATION INPUT CARD */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>SELECT EXTENSION DURATION</Text>

            <View style={styles.counterRow}>
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => adjustDays(-1)}
              >
                <Ionicons name="remove-outline" size={22} color={Colors.primary} />
              </TouchableOpacity>

              <View style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={manualDays}
                  onChangeText={handleManualInput}
                  placeholder="1"
                  placeholderTextColor={Colors.muted}
                />
                <Text style={styles.daySuffix}>Days</Text>
              </View>

              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => adjustDays(1)}
              >
                <Ionicons name="add-outline" size={22} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            {/* PRESET DAYS PILLS */}
            <View style={styles.presetRow}>
              {[1, 3, 7, 14, 30].map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[
                    styles.presetPill,
                    daysCount === d && styles.presetPillActive,
                  ]}
                  onPress={() => setPresetDays(d)}
                >
                  <Text
                    style={[
                      styles.presetText,
                      daysCount === d && styles.presetTextActive,
                    ]}
                  >
                    +{d} {d === 1 ? "Day" : "Days"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* EXTENSION SUMMARY & PRICE BREAKDOWN */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>EXTENSION DETAILS</Text>

            <View style={styles.breakdownList}>
              <View style={styles.breakdownRow}>
                <Text style={styles.rowLabel}>Current End Date</Text>
                <Text style={styles.rowValue}>{formatDate(currentEndDate)}</Text>
              </View>

              <View style={styles.breakdownRow}>
                <Text style={[styles.rowLabel, { color: "#059669" }]}>New End Date</Text>
                <Text style={[styles.rowValue, { color: "#059669", fontWeight: "800" }]}>
                  {formatDate(newEndDate)}
                </Text>
              </View>

              <View style={styles.divider} />
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Extension Fee</Text>
                <Text style={styles.totalValue}>${priceBreakdown.total}</Text>
              </View>
            </View>
          </View>

          {/* INSURANCE HIGHLIGHT */}
          <View style={styles.infoHighlight}>
            <Ionicons
              name="shield-checkmark"
              size={20}
              color="#059669"
            />
            <Text style={styles.infoHighlightText}>
              Your insurance coverage and 24/7 roadside assistance will remain fully active.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* FLOATING FOOTER BUTTON */}
      <View
        style={[
          styles.footer,
          { paddingBottom: (insets.bottom || 0) + 16, paddingTop: 16 },
        ]}
      >
        <View style={styles.priceContainer}>
          <Text style={styles.footerLabel}>Total Amount</Text>
          <Text style={styles.footerPrice}>
            ${priceBreakdown.total}
            <Text style={styles.perDay}> ({daysCount} {daysCount === 1 ? "day" : "days"})</Text>
          </Text>
        </View>

        <TouchableOpacity
          disabled={isLoading}
          style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator size={"small"} color={Colors.white} />
          ) : (
            <>
              <Text style={styles.buttonText}>
                Pay ${priceBreakdown.total}
              </Text>
              <Ionicons
                name="card-outline"
                size={18}
                color="#FFF"
                style={{ marginLeft: 6 }}
              />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ExtendLeaseScreen;

const styles = StyleSheet.create({
  centerWrapper: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
    color: "#94A3B8",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 20,
  },
  vehicleCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
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
  vehicleIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#E0F2FE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  vehicleInfo: { flex: 1 },
  vehicleBrand: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.primary,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
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
  cardTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 1,
    marginBottom: 16,
  },
  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  counterBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },
  inputBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 16,
    height: 52,
  },
  input: {
    flex: 1,
    fontSize: 20,
    fontWeight: "800",
    color: Colors.primary,
    textAlign: "center",
  },
  daySuffix: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748B",
  },
  presetRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
  },
  presetPill: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  presetPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  presetText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },
  presetTextActive: {
    color: "#FFFFFF",
  },

  breakdownList: {
    gap: 10,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  rowValue: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 2,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.primary,
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    zIndex: 50,
    ...Platform.select({
      ios: {
        shadowColor: "rgba(31, 48, 94, 0.15)",
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: { elevation: 12 },
    }),
  },
  priceContainer: {
    justifyContent: "center",
  },
  footerLabel: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  footerPrice: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.primary,
    marginTop: 2,
  },
  perDay: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    height: 52,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },
  buttonDisabled: {
    backgroundColor: "#CBD5E1",
    shadowOpacity: 0,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
