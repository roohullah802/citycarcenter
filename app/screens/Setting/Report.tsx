import { usePostIssues } from "@/hooks/useDocuments";
import { issueSchema } from "@/lib/zod/issueSchema";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import { showToast } from "../../../folder/toastService";

const ReportIssueScreen: React.FC = () => {
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [isFocused, setIsFocused] = useState<string | null>(null);

  const postIssue = usePostIssues();

  // Simple validation for button state
  const isValid = useMemo(
    () => description.trim().length > 5 && email.includes("@"),
    [description, email],
  );

  const handleSend = useCallback(async () => {
    const result = issueSchema.safeParse({ email, description });

    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message;
      showToast(errorMessage || "Validation failed");
      return;
    }

    postIssue.mutate({ email, description });
  }, [description, email, postIssue]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* --- HEADER --- */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="chevron-back" size={24} color="#1F305E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Support</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.textSection}>
            <Text style={styles.welcomeHeader}>Report an Issue</Text>
            <Text style={styles.subHeader}>
              Encountered a bug or have a concern? Let us know the details and
              we&apos;ll fix it as soon as possible.
            </Text>
          </View>

          {/* Email Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Email Address</Text>
            <View
              style={[
                styles.inputBox,
                isFocused === "email" && styles.inputFocused,
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={18}
                color="#9CA3AF"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="How can we reach you?"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onFocus={() => setIsFocused("email")}
                onBlur={() => setIsFocused(null)}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Description Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Detailed Description</Text>
            <View
              style={[
                styles.textAreaBox,
                isFocused === "desc" && styles.inputFocused,
              ]}
            >
              <TextInput
                style={styles.textArea}
                placeholder="Tell us exactly what happened..."
                placeholderTextColor="#9CA3AF"
                value={description}
                onFocus={() => setIsFocused("desc")}
                onBlur={() => setIsFocused(null)}
                onChangeText={setDescription}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: isValid ? "#1F305E" : "#E5E7EB" },
            ]}
            onPress={handleSend}
            disabled={!isValid || postIssue.isPending}
          >
            {postIssue.isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text
                  style={[
                    styles.buttonText,
                    { color: isValid ? "#FFF" : "#9CA3AF" },
                  ]}
                >
                  Send Report
                </Text>
                <Ionicons
                  name="send"
                  size={16}
                  color={isValid ? "#FFF" : "#9CA3AF"}
                  style={{ marginLeft: 8 }}
                />
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ReportIssueScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backBtn: { width: 40, height: 40, justifyContent: "center" },
  headerTitle: { fontSize: RFValue(16), fontFamily: "bold", color: "#1F305E" },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  textSection: {
    marginBottom: 25,
  },
  welcomeHeader: {
    fontSize: RFValue(20),
    fontFamily: "bold",
    color: "#111827",
    marginBottom: 6,
  },
  subHeader: {
    fontSize: RFValue(13),
    color: "#6B7280",
    fontFamily: "medium",
    lineHeight: 20,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: RFValue(12),
    fontFamily: "bold",
    color: "#374151",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
  },
  inputFocused: {
    borderColor: "#1F305E",
    backgroundColor: "#FFF",
    shadowColor: "#1F305E",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: RFValue(13),
    fontFamily: "medium",
    color: "#111827",
  },
  textAreaBox: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
  },
  textArea: {
    height: 150,
    fontSize: RFValue(13),
    fontFamily: "medium",
    color: "#111827",
  },
  submitButton: {
    flexDirection: "row",
    height: 54,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  buttonText: {
    fontSize: RFValue(14),
    fontFamily: "bold",
  },
});
