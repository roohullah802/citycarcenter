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
import { Colors } from "@/utils/Colors";
import { GlobalStyles } from "@/utils/GlobalStyles";

const ReportIssueScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [description, setDescription] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const postIssue = usePostIssues();

  const isValid = useMemo(
    () => description.trim().length >= 5,
    [description],
  );

  const handleSend = useCallback(async () => {
    const result = issueSchema.safeParse({ description });

    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message;
      showToast(errorMessage || "Validation failed");
      return;
    }

    postIssue.mutate({ description: description.trim() });
  }, [description, postIssue]);

  return (
    <View style={GlobalStyles.container}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* HEADER */}
        <View style={[GlobalStyles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
            <Ionicons name="chevron-back" size={28} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={GlobalStyles.headerTitle}>Report Issue</Text>
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
              Our team is here to assist. Describe the issue you&apos;re experiencing and we&apos;ll look into it right away.
            </Text>
          </View>

          {/* Description Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>ISSUE DETAILS</Text>
            <View
              style={[
                styles.textAreaBox,
                GlobalStyles.shadowLight,
                isFocused && styles.inputBoxFocused,
              ]}
            >
              <TextInput
                style={styles.textArea}
                placeholder="Please describe the issue in detail..."
                placeholderTextColor={Colors.muted}
                value={description}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChangeText={setDescription}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* SUBMIT BUTTON */}
          <TouchableOpacity
            style={[styles.submitBtn, !isValid && styles.submitBtnDisabled]}
            onPress={handleSend}
            disabled={!isValid || postIssue.isPending}
            activeOpacity={0.8}
          >
            {postIssue.isPending ? (
              <ActivityIndicator color={Colors.white} />
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
                  color={isValid ? Colors.white : Colors.muted}
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
  navBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: { padding: 24 },
  heroSection: { marginBottom: 32 },
  heroTitle: { fontSize: 26, fontWeight: "800", color: Colors.primary },
  heroSubtitle: {
    fontSize: 15,
    color: Colors.subtitle,
    marginTop: 8,
    lineHeight: 22,
  },
  inputGroup: { marginBottom: 24 },
  inputLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: Colors.muted,
    letterSpacing: 1.2,
    marginBottom: 10,
    marginLeft: 4,
  },
  inputBoxFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  textAreaBox: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    padding: 16,
  },
  textArea: {
    height: 160,
    fontSize: 15,
    fontWeight: "600",
    color: Colors.primary,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    height: 60,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  submitBtnDisabled: {
    backgroundColor: Colors.border,
    elevation: 0,
    shadowOpacity: 0,
  },
  submitBtnText: { color: Colors.white, fontSize: 16, fontWeight: "700" },
  textMuted: { color: Colors.muted },
});

export default ReportIssueScreen;
