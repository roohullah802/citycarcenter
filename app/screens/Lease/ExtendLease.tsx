import { ExtendRateOption, rateOptions } from "@/folder/rateOptions";
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
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const ExtendLeaseScreen = () => {
  const { id } = useLocalSearchParams();
  const [selectedRate, setSelectedRate] = useState<ExtendRateOption | null>(
    null,
  );
  const [manualDays, setManualDays] = useState<string>("1");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const handleSelectRate = useCallback((option: ExtendRateOption) => {
    setSelectedRate(option);
  }, []);

  const handleManualInput = useCallback((text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setManualDays(numericValue);
    setSelectedRate(null);
  }, []);

  const handleContinue = useCallback(async () => {
    const days = Number(manualDays);

    if (!days || days === 0) {
      return showToast("Please enter days number! ");
    }
    setIsLoading(true);
    try {
      const response = { clientSecret: "" };

      const clientSecret = response?.clientSecret;
      if (!clientSecret) throw new Error("Could not initialize payment");

      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: "City Car Center",
        paymentIntentClientSecret: clientSecret,
      });

      if (initError) throw initError;

      const { error: presentError } = await presentPaymentSheet();
      if (presentError) throw presentError;
      router.push("/screens/Payments/PaymentSuccess");
    } catch (error: any) {
      console.log(error);
      showToast(
        error?.data?.message || error?.message || "something error happened",
      );
    } finally {
      setIsLoading(false);
    }
  }, [manualDays, initPaymentSheet, presentPaymentSheet]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerCon}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.header}>Extend Lease</Text>
        </View>
        <Text style={styles.subHeader}>
          Choose how much days you want to extend the lease of the car
        </Text>

        <Text style={styles.sectionTitle}>Default Days with Rate</Text>

        <View style={styles.rateOptions}>
          {rateOptions.map((option) => {
            const isSelected = selectedRate?.type === option.type;
            return (
              <TouchableOpacity
                key={option.type}
                style={[styles.rateCard, isSelected && styles.selectedRateCard]}
                onPress={() => handleSelectRate(option)}
              >
                <Text style={styles.rateLabel}>
                  {option.label} {option.subLabel}
                </Text>
                <Text style={styles.rateValue}>{option.value.toFixed(2)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Or enter your days manually</Text>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={manualDays}
            onChangeText={handleManualInput}
            placeholder="Enter number of days"
            placeholderTextColor="#aaa"
          />
          <Text style={styles.daySuffix}>- Days</Text>
        </View>

        <TouchableOpacity
          disabled={isLoading}
          style={styles.button}
          onPress={handleContinue}
        >
          {isLoading ? (
            <ActivityIndicator size={"small"} color={"white"} />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ExtendLeaseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
    paddingBottom: 20,
    paddingTop: 40,
  },
  headerCon: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: Platform.OS === "ios" ? 50 : 10,
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  header: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#002A32",
    fontFamily: "bold",
  },
  subHeader: {
    fontSize: 13,
    color: "#444",
    marginBottom: 25,
    marginTop: 10,
    fontFamily: "demiBold",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
    color: "#111",
    fontFamily: "demiBold",
  },
  rateOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  rateCard: {
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedRateCard: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F8FF",
  },
  rateLabel: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
    marginBottom: 4,
    fontFamily: "demiBold",
  },
  rateValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    fontFamily: "demiBold",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 30,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    fontFamily: "demiBold",
  },
  daySuffix: {
    fontSize: 16,
    color: "#555",
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#73C2FB",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    opacity: 1,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "demiBold",
  },
});
