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

const ExtendLeaseScreen = () => {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

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
      const response = { clientSecret: "" };

      const clientSecret = response?.clientSecret;
      if (!clientSecret) throw new Error("Could not initialize payment");

      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: "City Car Center",
        paymentIntentClientSecret: clientSecret,
        appearance: {
          colors: { primary: "#73C2FB" },
          shapes: { borderRadius: 12 },
        },
      });

      if (initError) throw initError;

      const { error: presentError } = await presentPaymentSheet();
      if (presentError) throw presentError;

      router.push("/screens/Payments/PaymentSuccess");
    } catch (error: any) {
      showToast(error?.message || "Extension failed");
    } finally {
      setIsLoading(false);
    }
  }, [manualDays, initPaymentSheet, presentPaymentSheet]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Professional Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#1F305E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Extend Lease</Text>
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
          <View style={styles.inputWrapper}>
            <View style={styles.inputIcon}>
              <Ionicons name="calendar-outline" size={24} color="#73C2FB" />
            </View>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={manualDays}
              onChangeText={handleManualInput}
              placeholder="0"
              placeholderTextColor="#94A3B8"
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
              color="#1F305E"
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
            <ActivityIndicator size={"small"} color={"#FFF"} />
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
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F305E",
    letterSpacing: -0.5,
  },
  subText: {
    fontSize: 15,
    color: "#64748B",
    marginTop: 8,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 2,
    borderColor: "#F1F5F9",
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
    color: "#1F305E",
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
    color: "#1F305E",
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
    color: "#1F305E",
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
    color: "#64748B",
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: "#94A3B8",
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    backgroundColor: "#FFF",
  },
  primaryButton: {
    backgroundColor: "#73C2FB",
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#73C2FB",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: "#CBD5E1",
    shadowOpacity: 0,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
