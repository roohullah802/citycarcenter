import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";

import { useDocumentUploadLogic, DocKey } from "@/hooks/useDocumentUploadLogic";
import { DocumentCard } from "@/components/DocumentCard";

// --- Constants ---
const DOCUMENTS: { key: DocKey; label: string; required: boolean }[] = [
  { key: "cnicFront", label: "CNIC Front Side", required: true },
  { key: "cnicBack", label: "CNIC Back Side", required: true },
  { key: "drivingLicence", label: "Driving Licence", required: true },
  {
    key: "extraDocuments",
    label: "Additional Info (Optional)",
    required: false,
  },
];

const COLORS = {
  primary: "rgba(31, 48, 94, 0.88)",
  background: "#F9FAFB",
  white: "#FFFFFF",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray500: "#6B7280",
  gray900: "#111827",
};

// --- Main Component ---
export default function DocumentUploadScreen() {
  const {
    docs,
    isLoading,
    canContinue,
    handlePickImage,
    handleRemoveImage,
    handleSubmit,
  } = useDocumentUploadLogic();

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account Verification</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro Section */}
        <View style={styles.textSection}>
          <Text style={styles.title}>Submit Documents</Text>
          <Text style={styles.subtitle}>
            Please upload clear photos of your original identity documents to verify your account.
          </Text>
        </View>

        {/* Document Cards */}
        {DOCUMENTS.map((doc) => (
          <DocumentCard
            key={doc.key}
            docKey={doc.key}
            label={doc.label}
            required={doc.required}
            docs={docs}
            onPickImage={handlePickImage}
            onRemoveImage={handleRemoveImage}
          />
        ))}

        {/* Submit Button */}
        <TouchableOpacity
          disabled={!canContinue || isLoading}
          onPress={handleSubmit}
          style={[styles.submitBtn, (!canContinue || isLoading) && styles.disabledBtn]}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitText}>Submit for Review</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Stylings ---
const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  iconBtn: { width: 40, height: 40, justifyContent: "center" },
  headerTitle: { fontSize: RFValue(15), fontFamily: "bold", color: COLORS.primary },
  scrollContent: { padding: 20 },
  textSection: { marginBottom: 24 },
  title: { fontSize: RFValue(22), fontFamily: "bold", color: COLORS.gray900 },
  subtitle: {
    fontSize: RFValue(13),
    color: COLORS.gray500,
    marginTop: 6,
    fontFamily: "medium",
    lineHeight: 20,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 40,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
    }),
  },
  disabledBtn: { backgroundColor: COLORS.gray200, opacity: 0.8 },
  submitText: { color: COLORS.white, fontSize: RFValue(14), fontFamily: "bold" },
});
