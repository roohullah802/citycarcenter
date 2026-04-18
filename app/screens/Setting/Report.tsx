import { usePostIssues } from "@/hooks/useDocuments";
import { issueSchema } from "@/lib/zod/issueSchema";
import { Ionicons } from "@expo/vector-icons"; // Ensure expo/vector-icons is installed
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { showToast } from "../../../folder/toastService";

const { width } = Dimensions.get("window");

const ReportIssueScreen: React.FC = () => {
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");

  const postIssue = usePostIssues();

  const isValid = useMemo(
    () => description.trim().length > 5 && email.includes("@"),
    [description, email],
  );

  const handleSend = useCallback(async () => {
    // 1. Zod Validation
    const result = issueSchema.safeParse({ email, description });

    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message;
      showToast(errorMessage || "Validation failed");
      return;
    }

    postIssue.mutate({ email, description });
  }, [description, email, postIssue]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* --- CUSTOM HEADER --- */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={RFValue(22)} color="#333" />
        </TouchableOpacity>
        <Text style={styles.centerTitle}>Report Issue</Text>
        <View style={{ width: RFValue(40) }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.welcomeHeader}>Tell us what happened</Text>
        <Text style={styles.subHeader}>
          Describe your problem in detail. Our team will review your report and
          get back to you shortly.
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="email@example.com"
            placeholderTextColor="#AAA"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Issue Description</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Please provide as much detail as possible..."
            placeholderTextColor="#AAA"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isValid ? "#73C2FB" : "#E0E0E0" },
          ]}
          onPress={handleSend}
          disabled={!isValid || postIssue.isPending}
        >
          {postIssue.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Submit Report</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ReportIssueScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.03,
    paddingTop: Platform.OS === "ios" ? RFValue(45) : RFValue(35),
    paddingBottom: RFValue(10),
    backgroundColor: "#fff",
  },
  backButton: {
    padding: RFValue(8),
    width: RFValue(40),
  },
  centerTitle: {
    fontSize: RFValue(16),
    fontFamily: "bold",
    color: "#1A1A1A",
    textAlign: "center",
  },
  content: {
    paddingHorizontal: width * 0.06,
    paddingTop: RFValue(20),
    paddingBottom: RFValue(30),
  },
  welcomeHeader: {
    fontSize: RFValue(20),
    fontFamily: "bold",
    color: "#333",
    marginBottom: RFValue(6),
  },
  subHeader: {
    fontSize: RFValue(13),
    color: "#666",
    marginBottom: RFValue(25),
    fontFamily: "medium",
    lineHeight: RFValue(18),
  },
  inputContainer: {
    marginBottom: RFValue(18),
  },
  label: {
    fontSize: RFValue(12),
    fontFamily: "demiBold",
    color: "#444",
    marginBottom: RFValue(6),
    marginLeft: 2,
  },
  input: {
    height: RFValue(48),
    borderColor: "#EEE",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: RFValue(14),
    fontSize: RFValue(13),
    fontFamily: "regular",
    backgroundColor: "#FBFBFB",
    color: "#333",
  },
  textArea: {
    height: RFValue(150),
    borderColor: "#EEE",
    borderWidth: 1.5,
    borderRadius: 12,
    padding: RFValue(14),
    fontSize: RFValue(13),
    fontFamily: "regular",
    backgroundColor: "#FBFBFB",
    color: "#333",
  },
  button: {
    height: RFValue(50),
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: RFValue(10),
    // Soft shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: RFValue(14),
    fontFamily: "bold",
  },
});
