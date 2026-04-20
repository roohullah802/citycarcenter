import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  StatusBar,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFValue } from "react-native-responsive-fontsize";
import { router } from "expo-router";
import { useUser } from "@clerk/expo";
import { useUploadDocs } from "@/hooks/useDocuments";
import { showToast } from "@/folder/toastService";
import { uploadFile } from "@/folder/upload";

type DocKey = "cnicFront" | "cnicBack" | "drivingLicence" | "extraDocuments";

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

export default function DocumentUploadScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const [docs, setDocs] = useState<Record<DocKey, string | null>>({
    cnicFront: null,
    cnicBack: null,
    drivingLicence: null,
    extraDocuments: null,
  });

  const { mutateAsync: uploadDocToDB } = useUploadDocs();

  const pickImage = async (key: DocKey) => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Gallery access is needed.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setDocs((prev) => ({ ...prev, [key]: result.assets[0].uri }));
    }
  };

  const canContinue = useMemo(
    () => docs.cnicFront && docs.cnicBack && docs.drivingLicence,
    [docs],
  );

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const uploadPromises = DOCUMENTS.filter((d) => docs[d.key]).map(
        async (doc) => {
          const uri = docs[doc.key]!;
          const fileName = `${doc.key}_${user?.id}_${Date.now()}.jpg`;
          const result = await uploadFile(uri, fileName);
          return { key: doc.key, url: result?.url };
        },
      );

      const results = await Promise.all(uploadPromises);

      const payload = {
        clerkId: user?.id,
        cnicFront: results.find((r) => r.key === "cnicFront")?.url,
        cnicBack: results.find((r) => r.key === "cnicBack")?.url,
        drivingLicence: results.find((r) => r.key === "drivingLicence")?.url,
        extraDocuments:
          results.find((r) => r.key === "extraDocuments")?.url || "",
      };

      await uploadDocToDB(payload);

      showToast("Documents submitted for review!");
      router.push("/screens/Setting/DocumentSubmittedScreen");
    } catch (err: any) {
      console.log("Upload Error: ", err);
      showToast(err.message || "Upload failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={24} color="#1F305E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verification</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.textSection}>
          <Text style={styles.title}>Submit Documents</Text>
          <Text style={styles.subtitle}>
            Upload clear photos of your original IDs from your gallery.
          </Text>
        </View>

        {DOCUMENTS.map((doc) => (
          <View
            key={doc.key}
            style={[styles.card, docs[doc.key] && styles.activeCard]}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.label}>{doc.label}</Text>
              {doc.required && <View style={styles.requiredDot} />}
            </View>

            {docs[doc.key] ? (
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: docs[doc.key]! }}
                  style={styles.preview}
                />
                <TouchableOpacity
                  style={styles.removeBadge}
                  onPress={() =>
                    setDocs((prev) => ({ ...prev, [doc.key]: null }))
                  }
                >
                  <Ionicons name="close" size={16} color="#FFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.placeholder}
                onPress={() => pickImage(doc.key)}
                activeOpacity={0.6}
              >
                <Ionicons name="images-outline" size={40} color="#D1D5DB" />
                <Text style={styles.placeholderText}>
                  Tap to pick from Gallery
                </Text>
              </TouchableOpacity>
            )}

            {docs[doc.key] && (
              <TouchableOpacity
                style={styles.changeBtn}
                onPress={() => pickImage(doc.key)}
              >
                <Text style={styles.changeText}>Choose another photo</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity
          disabled={!canContinue || isLoading}
          onPress={handleSubmit}
          style={[
            styles.submitBtn,
            (!canContinue || isLoading) && styles.disabledBtn,
          ]}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitText}>Submit for Verification</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  iconBtn: { width: 40, height: 40, justifyContent: "center" },
  headerTitle: { fontSize: RFValue(16), fontFamily: "bold", color: "#1F305E" },
  scrollContent: { padding: 20 },
  textSection: { marginBottom: 20 },
  title: { fontSize: RFValue(20), fontFamily: "bold", color: "#111827" },
  subtitle: {
    fontSize: RFValue(13),
    color: "#6B7280",
    marginTop: 4,
    fontFamily: "medium",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  activeCard: { borderColor: "#1F305E", backgroundColor: "#F0F7FF" },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  label: { fontSize: RFValue(13), fontFamily: "bold", color: "#374151" },
  requiredDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#EF4444",
    marginLeft: 6,
  },
  placeholder: {
    height: 150,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  placeholderText: {
    fontSize: RFValue(12),
    color: "#9CA3AF",
    marginTop: 10,
    fontFamily: "bold",
  },
  imageWrapper: { height: 200, borderRadius: 12, overflow: "hidden" },
  preview: { width: "100%", height: "100%" },
  removeBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 6,
    borderRadius: 20,
  },
  changeBtn: { marginTop: 12, alignSelf: "center" },
  changeText: { color: "#1F305E", fontFamily: "bold", fontSize: RFValue(12) },
  submitBtn: {
    backgroundColor: "#73C2FB",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  disabledBtn: { backgroundColor: "#E5E7EB" },
  submitText: { color: "#FFF", fontSize: RFValue(14), fontFamily: "bold" },
});
