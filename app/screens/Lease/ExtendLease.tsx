import { showToast } from "@/folder/toastService";
import { useStripe } from "@stripe/stripe-react-native";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
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
import { Colors } from "@/utils/Colors";
import { GlobalStyles } from "@/utils/GlobalStyles";
import { useUser } from "@clerk/expo";

const ExtendLeaseScreen = () => {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const createIntent = useCreateIntent();
  const { user } = useUser();

  const [manualDays, setManualDays] = useState<string>("1");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleManualInput = useCallback((text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setManualDays(numericValue);
  }, []);

  const handleContinue = useCallback(async () => {
    const days = Number(manualDays);

    if (!days || days === 0) {
      return showToast("Please enter a valid number of days");
    }

    setIsLoading(true);
    try {
      const mongodbId = user?.publicMetadata?.mongodbId;

      if (!mongodbId) throw new Error("User session expired. Please re-login.");

      const result = await createIntent.mutateAsync({
        action: "extendLease",
        userId: mongodbId,
        leaseId: id,
        days: days,
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
      if (presentError) throw presentError;

      router.push("/screens/Payments/PaymentSuccess");
    } catch (error: any) {
      const serverData = error?.response?.data;
      const serverMessage = serverData?.message || serverData?.error || serverData;
      let finalMessage = serverMessage || error?.message || "Extension failed";

      if (Array.isArray(finalMessage)) {
        finalMessage = finalMessage.join(", ");
      } else if (typeof finalMessage === "object") {
        finalMessage = JSON.stringify(finalMessage);
      }

      showToast(String(finalMessage));
    } finally {
      setIsLoading(false);
    }
  }, [
    manualDays,
    initPaymentSheet,
    presentPaymentSheet,
    createIntent,
    id,
    user,
  ]);

  return (
    <View style={GlobalStyles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Professional Header */}
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
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.introSection}>
            <Text style={styles.welcomeText}>Custom Extension</Text>
            <Text style={styles.subText}>
              Enter the specific number of days you would like to keep the
              vehicle.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Duration</Text>
          <View style={[GlobalStyles.inputBox, GlobalStyles.shadowLight, { height: 80, borderRadius: 24, marginBottom: 32 }]}>
            <View style={styles.inputIcon}>
              <Ionicons name="calendar-outline" size={24} color={Colors.info} />
            </View>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={manualDays}
              onChangeText={handleManualInput}
              placeholder="0"
              placeholderTextColor={Colors.muted}
              autoFocus={true}
            />
            <View style={styles.suffixBadge}>
              <Text style={styles.daySuffix}>Days</Text>
            </View>
          </View>

          <View style={styles.infoHighlight}>
            <Ionicons
              name="shield-checkmark-outline"
              size={22}
              color={Colors.primary}
            />
            <Text style={styles.infoHighlightText}>
              Daily rates apply based on your original agreement. Insurance
              coverage remains active.
            </Text>
          </View>

          <View style={styles.tipBox}>
            <Text style={styles.tipTitle}>Note:</Text>
            <Text style={styles.tipText}>
              Extension starts immediately after your current lease ends. Ensure
              you have sufficient funds for the selected period.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Fixed Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity
          disabled={isLoading}
          style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator size={"small"} color={Colors.white} />
          ) : (
            <Text style={styles.buttonText}>Confirm & Pay</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ExtendLeaseScreen;

const styles = StyleSheet.create({
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 24,
  },
  introSection: {
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  subText: {
    fontSize: 15,
    color: Colors.subtitle,
    marginTop: 8,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.muted,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 24,
    paddingHorizontal: 20,
    height: 80,
    marginBottom: 32,
  },
  inputIcon: {
    marginRight: 16,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: "800",
    color: Colors.primary,
  },
  suffixBadge: {
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  daySuffix: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.primary,
  },
  infoHighlight: {
    flexDirection: "row",
    backgroundColor: "#F0F9FF",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0F2FE",
    marginBottom: 24,
  },
  infoHighlightText: {
    flex: 1,
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 12,
    lineHeight: 20,
    fontWeight: "500",
  },
  tipBox: {
    padding: 16,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.subtitle,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: Colors.muted,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      android: { elevation: 6 },
    }),
  },
  buttonDisabled: {
    backgroundColor: "#CBD5E1",
    shadowOpacity: 0,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
});
