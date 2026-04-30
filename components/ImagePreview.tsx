import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface ImagePreviewProps {
  uri: string;
  onRemove: () => void;
}

export const ImagePreview = ({ uri, onRemove }: ImagePreviewProps) => (
  <View style={styles.imageWrapper}>
    <Image source={{ uri }} style={styles.preview} cachePolicy={"memory-disk"} transition={300} />
    <TouchableOpacity style={styles.removeBadge} onPress={onRemove}>
      <Ionicons name="close" size={16} color="#FFF" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  imageWrapper: {
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative"
  },
  preview: {
    width: "100%",
    height: "100%",
    resizeMode: 'cover'
  },
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
});
