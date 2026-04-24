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
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { showToast } from "../../../folder/toastService";

const ReportIssueScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [isFocused, setIsFocused] = useState<string | null>(null);

  const postIssue = usePostIssues();

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
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* PROFESSIONAL HEADER */}
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
            <Ionicons name="chevron-back" size={28} color="rgba(31, 48, 94, 0.88)" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Report Issue</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>How can we help?</Text>
            <Text style={styles.heroSubtitle}>
              Our team is here to assist. Please describe the problem
              you&apos;re experiencing in detail.
            </Text>
          </View>

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
            <View
              style={[
                styles.inputBox,
                isFocused === "email" && styles.inputBoxFocused,
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color={isFocused === "email" ? "rgba(31, 48, 94, 0.88)" : "#94A3B8"}
                style={styles.icon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your contact email"
                placeholderTextColor="#94A3B8"
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
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>ISSUE DETAILS</Text>
            <View
              style={[
                styles.textAreaBox,
                isFocused === "desc" && styles.inputBoxFocused,
              ]}
            >
              <TextInput
                style={styles.textArea}
                placeholder="Please provide as much information as possible..."
                placeholderTextColor="#94A3B8"
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

          {/* SEND BUTTON */}
          <TouchableOpacity
            style={[styles.submitBtn, !isValid && styles.submitBtnDisabled]}
            onPress={handleSend}
            disabled={!isValid || postIssue.isPending}
            activeOpacity={0.8}
          >
            {postIssue.isPending ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Text
                  style={[styles.submitBtnText, !isValid && styles.textMuted]}
                >
                  Submit Report
                </Text>
                <Ionicons
                  name="paper-plane"
                  size={18}
                  color={isValid ? "#FFF" : "#94A3B8"}
                  style={{ marginLeft: 10 }}
                />
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  navBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "rgba(31, 48, 94, 0.88)" },
  scrollContent: { padding: 24 },
  heroSection: { marginBottom: 32 },
  heroTitle: { fontSize: 26, fontWeight: "800", color: "rgba(31, 48, 94, 0.88)" },
  heroSubtitle: {
    fontSize: 15,
    color: "#64748B",
    marginTop: 8,
    lineHeight: 22,
  },
  inputGroup: { marginBottom: 24 },
  inputLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 1.2,
    marginBottom: 10,
    marginLeft: 4,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    ...Platform.select({
      ios: {
        shadowColor: "rgba(31, 48, 94, 0.88)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  inputBoxFocused: {
    borderColor: "rgba(31, 48, 94, 0.88)",
    backgroundColor: "#FFF",
  },
  icon: { marginRight: 12 },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "rgba(31, 48, 94, 0.88)",
  },
  textAreaBox: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    borderRadius: 20,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "rgba(31, 48, 94, 0.88)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  textArea: {
    height: 160,
    fontSize: 15,
    fontWeight: "600",
    color: "rgba(31, 48, 94, 0.88)",
  },
  submitBtn: {
    backgroundColor: "rgba(31, 48, 94, 0.88)",
    height: 60,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "rgba(31, 48, 94, 0.88)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  submitBtnDisabled: {
    backgroundColor: "#F1F5F9",
    elevation: 0,
    shadowOpacity: 0,
  },
  submitBtnText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  textMuted: { color: "#94A3B8" },
});

export default ReportIssueScreen;
