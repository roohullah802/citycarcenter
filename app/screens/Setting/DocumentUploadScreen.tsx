import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import { DocumentCard } from "@/components/DocumentCard";
import { useDocumentUploadLogic } from "@/hooks/useDocumentUploadLogic";

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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#1F2937" />
        </TouchableOpacity>

        <Text style={styles.title}>Account Verification</Text>
        
        <View style={{ width: 40 }} /> {/* Placeholder for centering title */}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Submit Documents</Text>
        <Text style={styles.subtext}>
          Please upload clear photos of your original documents to verify your account.
        </Text>

        <DocumentCard
          docKey="cnicFront"
          label="CNIC Front"
          required={true}
          docs={docs}
          onPickImage={handlePickImage}
          onRemoveImage={handleRemoveImage}
        />

        <DocumentCard
          docKey="cnicBack"
          label="CNIC Back"
          required={true}
          docs={docs}
          onPickImage={handlePickImage}
          onRemoveImage={handleRemoveImage}
        />

        <DocumentCard
          docKey="drivingLicence"
          label="Driving Licence"
          required={true}
          docs={docs}
          onPickImage={handlePickImage}
          onRemoveImage={handleRemoveImage}
        />

        <DocumentCard
          docKey="extraDocuments"
          label="Extra Documents (Optional)"
          required={false}
          docs={docs}
          onPickImage={handlePickImage}
          onRemoveImage={handleRemoveImage}
        />

        <TouchableOpacity
          style={[styles.submitBtn, !canContinue && styles.submitBtnDisabled]}
          disabled={!canContinue || isLoading}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitBtnText}>Submit Documents</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: RFValue(14),
    fontFamily: "bold",
    color: "#1F2937",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: RFValue(20),
    fontFamily: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  subtext: {
    fontSize: RFValue(12),
    color: "#6B7280",
    marginBottom: 24,
    lineHeight: 20,
  },
  submitBtn: {
    backgroundColor: "rgba(31, 48, 94, 0.88)",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "rgba(31, 48, 94, 0.88)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnDisabled: {
    backgroundColor: "#D1D5DB",
    shadowOpacity: 0,
    elevation: 0,
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontSize: RFValue(14),
    fontFamily: "bold",
  },
});
