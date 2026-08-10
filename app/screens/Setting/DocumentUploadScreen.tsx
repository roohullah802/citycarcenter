import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DocumentUploadScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text>Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Account Verification</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.heading}>Submit Documents</Text>

        <Text>Please upload your documents to verify your account.</Text>
      </View>
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
    padding: 20,
    backgroundColor: "#FFFFFF",
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
  },

  content: {
    padding: 20,
  },

  heading: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
  },
});
