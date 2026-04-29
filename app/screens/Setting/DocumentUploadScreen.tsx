import { showToast } from "@/folder/toastService";
import { uploadFile } from "@/folder/upload";
import { useUploadDocs } from "@/hooks/useDocuments";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
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

// --- Types & Interfaces ---

type DocKey = "cnicFront" | "cnicBack" | "drivingLicence" | "extraDocuments";

interface ImageAsset {
  uri: string;
  base64: string | null;
}

interface DocState {
  cnicFront: ImageAsset | null;
  cnicBack: ImageAsset | null;
  drivingLicence: ImageAsset | null;
  extraDocuments: ImageAsset[];
}

interface UploadResult {
  key: DocKey;
  url: string;
  fileId: string;
}

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

// --- Helper Components ---

const ImagePreview = ({ uri, onRemove }: { uri: string; onRemove: () => void }) => (
  <View style={styles.imageWrapper}>
    <Image source={{ uri }} style={styles.preview} />
    <TouchableOpacity style={styles.removeBadge} onPress={onRemove}>
      <Ionicons name="close" size={16} color="#FFF" />
    </TouchableOpacity>
  </View>
);

// --- Main Component ---

export default function DocumentUploadScreen() {
  const { user } = useUser();
  const { mutateAsync: uploadDocToDB } = useUploadDocs();

  const [isLoading, setIsLoading] = useState(false);
  const [docs, setDocs] = useState<DocState>({
    cnicFront: null,
    cnicBack: null,
    drivingLicence: null,
    extraDocuments: [],
  });

  const canContinue = useMemo(
    () => !!(docs.cnicFront && docs.cnicBack && docs.drivingLicence),
    [docs]
  );

  const handlePickImage = async (key: DocKey) => {
    const isExtra = key === "extraDocuments";
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", "Gallery access is needed to upload documents.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: !isExtra,
      allowsMultipleSelection: isExtra,
      aspect: [4, 3],
      quality: 0.8, // Slightly reduced quality for better upload speed
      base64: true,
    });

    if (result.canceled) return;

    if (isExtra) {
      const newDocs = result.assets.map((asset) => ({
        uri: asset.uri,
        base64: asset.base64 || null,
      }));
      setDocs((prev) => ({
        ...prev,
        extraDocuments: [...prev.extraDocuments, ...newDocs],
      }));
    } else {
      const asset = result.assets[0];
      setDocs((prev) => ({
        ...prev,
        [key]: { uri: asset.uri, base64: asset.base64 || null },
      }));
    }
  };

  const handleRemoveImage = (key: DocKey, index?: number) => {
    if (key === "extraDocuments" && typeof index === "number") {
      setDocs((prev) => ({
        ...prev,
        extraDocuments: prev.extraDocuments.filter((_, i) => i !== index),
      }));
    } else {
      setDocs((prev) => ({ ...prev, [key]: null }));
    }
  };

  const uploadSingleFile = async (asset: ImageAsset, key: string, identifier: string): Promise<UploadResult> => {
    const fileName = `${key}_${user?.id}_${identifier}_${Date.now()}.jpg`;
    const fileToUpload = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
    const result = await uploadFile(fileToUpload, fileName);

    if (!result?.url || !result?.fileId) {
      throw new Error(`Failed to upload ${key}`);
    }

    return {
      key: key as DocKey,
      url: result.url,
      fileId: result.fileId,
    };
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      showToast("User session not found. Please log in again.");
      return;
    }

    setIsLoading(true);
    try {
      const uploadPromises: Promise<UploadResult>[] = [];

      // 1. Prepare Identity Documents
      const identityKeys: (keyof Omit<DocState, "extraDocuments">)[] = ["cnicFront", "cnicBack", "drivingLicence"];
      identityKeys.forEach((key) => {
        const asset = docs[key];
        if (asset) {
          uploadPromises.push(uploadSingleFile(asset, key, "identity"));
        }
      });

      // 2. Prepare Additional Documents
      docs.extraDocuments.forEach((asset, index) => {
        uploadPromises.push(uploadSingleFile(asset, "extraDocuments", `extra_${index}`));
      });

      // 3. Execute All Uploads
      console.log(`Starting upload for ${uploadPromises.length} files...`);
      const results = await Promise.all(uploadPromises);
      console.log("Upload Results Recap:", results.map(r => r.key));

      // 4. Construct Final Payload
      const getDocResult = (key: DocKey) => {
        const res = results.find((r) => r.key === key);
        return res ? { url: res.url, fileId: res.fileId } : undefined;
      };

      const payload = {
        clerkId: user.id,
        cnicFront: getDocResult("cnicFront"),
        cnicBack: getDocResult("cnicBack"),
        drivingLicence: getDocResult("drivingLicence"),
        extraDocuments: results
          .filter((r) => r.key === "extraDocuments")
          .map((r) => ({ url: r.url, fileId: r.fileId })),
      };
      // 5. Save to DB
      await uploadDocToDB(payload);

      showToast("Documents submitted successfully!");
      router.push("/screens/Setting/DocumentSubmittedScreen");
    } catch (err: any) {
      console.error("Submission Error Details:", err);
      showToast(err.message || "Failed to submit documents. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
        {DOCUMENTS.map((doc) => {
          const isExtra = doc.key === "extraDocuments";
          const hasDocs = isExtra ? docs.extraDocuments.length > 0 : !!docs[doc.key as keyof DocState];

          return (
            <View key={doc.key} style={[styles.card, hasDocs && styles.activeCard]}>
              <View style={styles.cardHeader}>
                <Text style={styles.label}>{doc.label}</Text>
                {doc.required && <View style={styles.requiredDot} />}
              </View>

              {isExtra ? (
                <View>
                  {docs.extraDocuments.map((item, index) => (
                    <View key={index} style={{ marginBottom: 12 }}>
                      <ImagePreview
                        uri={item.uri}
                        onRemove={() => handleRemoveImage("extraDocuments", index)}
                      />
                    </View>
                  ))}

                  <TouchableOpacity
                    style={[styles.placeholder, docs.extraDocuments.length > 0 && styles.miniPlaceholder]}
                    onPress={() => handlePickImage(doc.key)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={docs.extraDocuments.length > 0 ? "add-circle" : "images-outline"}
                      size={docs.extraDocuments.length > 0 ? 32 : 40}
                      color={COLORS.gray400}
                    />
                    <Text style={styles.placeholderText}>
                      {docs.extraDocuments.length > 0 ? "Add more documents" : "Pick from Gallery"}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : docs[doc.key as keyof DocState] ? (
                <View>
                  <ImagePreview
                    uri={(docs[doc.key as keyof DocState] as ImageAsset).uri}
                    onRemove={() => handleRemoveImage(doc.key)}
                  />
                  <TouchableOpacity
                    style={styles.changeBtn}
                    onPress={() => handlePickImage(doc.key)}
                  >
                    <Text style={styles.changeText}>Change Photo</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.placeholder}
                  onPress={() => handlePickImage(doc.key)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="images-outline" size={40} color={COLORS.gray400} />
                  <Text style={styles.placeholderText}>Tap to pick from Gallery</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}

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

// --- Stylings & Themes ---

const COLORS = {
  primary: "rgba(31, 48, 94, 0.88)",
  background: "#F9FAFB",
  white: "#FFFFFF",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray800: "#1F2937",
  gray900: "#111827",
  error: "#EF4444",
  success: "#10B981",
  activeBg: "#F0F7FF",
};

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
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.gray100,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: { elevation: 3 },
    }),
  },
  activeCard: { borderColor: COLORS.primary, backgroundColor: COLORS.activeBg },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  label: { fontSize: RFValue(13), fontFamily: "bold", color: COLORS.gray800 },
  requiredDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.error,
    marginLeft: 6,
  },
  placeholder: {
    height: 140,
    backgroundColor: COLORS.gray50,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: 1.5,
    borderColor: COLORS.gray200,
  },
  miniPlaceholder: { height: 80, borderStyle: 'solid' },
  placeholderText: {
    fontSize: RFValue(12),
    color: COLORS.gray400,
    marginTop: 8,
    fontFamily: "bold",
  },
  imageWrapper: { height: 180, borderRadius: 16, overflow: "hidden", position: "relative" },
  preview: { width: "100%", height: "100%", resizeMode: 'cover' },
  removeBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  changeBtn: { marginTop: 14, alignSelf: "center", paddingVertical: 4 },
  changeText: { color: COLORS.primary, fontFamily: "bold", fontSize: RFValue(12) },
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
