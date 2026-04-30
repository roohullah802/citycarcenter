import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { ImagePreview } from "./ImagePreview";
import { DocKey, DocState } from "@/hooks/useDocumentUploadLogic";

interface DocumentCardProps {
  docKey: DocKey;
  label: string;
  required: boolean;
  docs: DocState;
  onPickImage: (key: DocKey) => void;
  onRemoveImage: (key: DocKey, index?: number) => void;
}

const COLORS = {
  primary: "rgba(31, 48, 94, 0.88)",
  white: "#FFFFFF",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray400: "#9CA3AF",
  gray800: "#1F2937",
  error: "#EF4444",
  activeBg: "#F0F7FF",
};

export const DocumentCard = ({
  docKey,
  label,
  required,
  docs,
  onPickImage,
  onRemoveImage,
}: DocumentCardProps) => {
  const isExtra = docKey === "extraDocuments";
  const hasDocs = isExtra ? docs.extraDocuments.length > 0 : !!docs[docKey];

  return (
    <View style={[styles.card, hasDocs && styles.activeCard]}>
      <View style={styles.cardHeader}>
        <Text style={styles.label}>{label}</Text>
        {required && <View style={styles.requiredDot} />}
      </View>

      {isExtra ? (
        <View>
          {docs.extraDocuments.map((item, index) => (
            <View key={index} style={{ marginBottom: 12 }}>
              <ImagePreview
                uri={item.uri}
                onRemove={() => onRemoveImage("extraDocuments", index)}
              />
            </View>
          ))}

          <TouchableOpacity
            style={[styles.placeholder, docs.extraDocuments.length > 0 && styles.miniPlaceholder]}
            onPress={() => onPickImage(docKey)}
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
      ) : docs[docKey] ? (
        <View>
          <ImagePreview
            uri={docs[docKey]!.uri}
            onRemove={() => onRemoveImage(docKey)}
          />
          <TouchableOpacity
            style={styles.changeBtn}
            onPress={() => onPickImage(docKey)}
          >
            <Text style={styles.changeText}>Change Photo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.placeholder}
          onPress={() => onPickImage(docKey)}
          activeOpacity={0.7}
        >
          <Ionicons name="images-outline" size={40} color={COLORS.gray400} />
          <Text style={styles.placeholderText}>Tap to pick from Gallery</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  miniPlaceholder: { height: 80, borderStyle: 'solid' as const },
  placeholderText: {
    fontSize: RFValue(12),
    color: COLORS.gray400,
    marginTop: 8,
    fontFamily: "bold",
  },
  changeBtn: { marginTop: 14, alignSelf: "center", paddingVertical: 4 },
  changeText: { color: COLORS.primary, fontFamily: "bold", fontSize: RFValue(12) },
});
