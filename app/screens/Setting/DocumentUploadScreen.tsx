import { axiosInstance } from "@/folder/axiosInstance";
import { showToast } from "@/folder/toastService";
import { uploadFile } from "@/folder/upload";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

type DocKey = "cnicFront" | "cnicBack" | "drivingLicence" | "extraDocuments";

const DOCUMENTS: { label: string; key: DocKey; required: boolean }[] = [
  { label: "CNIC Front", key: "cnicFront", required: true },
  { label: "CNIC Back", key: "cnicBack", required: true },
  { label: "Driving License", key: "drivingLicence", required: true },
  { label: "Additional Documents", key: "extraDocuments", required: false },
];

export default function DocumentUploadScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const [docs, setDocs] = useState<Record<DocKey, string | null>>({
    cnicFront: null,
    cnicBack: null,
    drivingLicence: null,
    extraDocuments: null,
  });

  const pickImage = async (key: DocKey, mode: "camera" | "library") => {
    const options: ImagePicker.ImagePickerOptions = {
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    };

    const res =
      mode === "camera"
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

    if (!res.canceled) {
      setDocs((prev) => ({ ...prev, [key]: res.assets[0].uri }));
    }
  };

  const canContinue = useMemo(
    () => docs.cnicFront && docs.cnicBack && docs.drivingLicence,
    [docs],
  );

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const uploadPromises = DOCUMENTS.map(async (doc) => {
        const uri = docs[doc.key];
        if (uri) {
          const uploadResult = await uploadFile(
            uri,
            `${doc.key}_${user?.id}.jpg`,
          );
          return { key: doc.key, url: uploadResult.url };
        }
        return { key: doc.key, url: null };
      });

      const results = await Promise.all(uploadPromises);

      const payload = {
        clerkId: user?.id,
        cnicFront: results.find((r) => r.key === "cnicFront")?.url,
        cnicBack: results.find((r) => r.key === "cnicBack")?.url,
        drivingLicence: results.find((r) => r.key === "drivingLicence")?.url,
        extraDocuments: results.find((r) => r.key === "extraDocuments")?.url,
      };

      const res = await axiosInstance.post("/users/documents/save", payload);
      if (res.data) {
        showToast("Verification submitted successfully!");
        router.push("/screens/Setting/DocumentSubmittedScreen");
      }
    } catch (err: any) {
      showToast("Upload failed. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* --- HEADER --- */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={RFValue(22)} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account Verification</Text>
        <View style={{ width: RFValue(40) }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Submit Documents</Text>
        <Text style={styles.subtitle}>
          Upload clear photos of your original documents to verify your account.
        </Text>

        {DOCUMENTS.map((doc) => (
          <View key={doc.key} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.label}>{doc.label}</Text>
              {doc.required && (
                <Text style={styles.requiredBadge}>Required</Text>
              )}
            </View>

            {docs[doc.key] ? (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: docs[doc.key]! }}
                  style={styles.preview}
                />
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() =>
                    setDocs((prev) => ({ ...prev, [doc.key]: null }))
                  }
                >
                  <Ionicons name="close-circle" size={24} color="#FF4E4E" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.placeholder}>
                <Ionicons
                  name="cloud-upload-outline"
                  size={RFValue(32)}
                  color="#CCC"
                />
                <Text style={styles.placeholderText}>No file selected</Text>
              </View>
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.uploadBtn}
                onPress={() => pickImage(doc.key, "library")}
              >
                <Ionicons name="images-outline" size={18} color="#555" />
                <Text style={styles.uploadText}>Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.uploadBtn]}
                onPress={() => pickImage(doc.key, "camera")}
              >
                <Ionicons name="camera-outline" size={18} color="#555" />
                <Text style={styles.uploadText}>Camera</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity
          disabled={!canContinue || isLoading}
          onPress={handleSubmit}
          style={[
            styles.continueBtn,
            (!canContinue || isLoading) && styles.disabledBtn,
          ]}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.continueText}>Submit for Verification</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#F8F9FA" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 15,
    backgroundColor: "#FFF",
  },
  headerTitle: { fontSize: RFValue(16), fontWeight: "700", color: "#1A1A1A" },
  backBtn: { width: 40 },
  scrollContent: {
    paddingHorizontal: width * 0.05,
    paddingBottom: 50,
    paddingTop: 20,
  },
  title: { fontSize: RFValue(20), fontWeight: "bold", color: "#222" },
  subtitle: {
    fontSize: RFValue(13),
    marginTop: 6,
    marginBottom: 25,
    color: "#666",
    lineHeight: 18,
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EEE",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  label: { fontSize: RFValue(14), fontWeight: "600", color: "#333" },
  requiredBadge: { fontSize: RFValue(10), color: "#FF4E4E", fontWeight: "700" },

  imageContainer: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    overflow: "hidden",
  },
  preview: { width: "100%", height: "100%", resizeMode: "cover" },
  placeholder: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    backgroundColor: "#FBFBFB",
    borderStyle: "dashed",
    borderWidth: 1.5,
    borderColor: "#DDD",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  placeholderText: { color: "#AAA", fontSize: RFValue(11), marginTop: 8 },

  buttonRow: { flexDirection: "row", gap: 10, marginTop: 15 },
  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    paddingVertical: 12,
    borderRadius: 10,
    flex: 1,
    justifyContent: "center",
    gap: 8,
  },
  uploadText: { color: "#555", fontSize: RFValue(12), fontWeight: "600" },

  removeBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FFF",
    borderRadius: 20,
  },

  continueBtn: {
    backgroundColor: "#73C2FB",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 15,
    shadowColor: "#73C2FB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledBtn: { backgroundColor: "#CCC", shadowOpacity: 0 },
  continueText: {
    color: "#fff",
    textAlign: "center",
    fontSize: RFValue(15),
    fontWeight: "bold",
  },
});
