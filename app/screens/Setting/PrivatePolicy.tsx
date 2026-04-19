import { usePolicy } from "@/hooks/useContent";
import { router } from "expo-router";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

const TermsPrivacyScreen: React.FC = () => {
  const { data, isError, isLoading, refetch } = usePolicy();

  const policyData = useMemo(() => data?.policy || [], [data]);

  const renderedPolicySections = useMemo(() => {
    if (!isLoading && policyData.length === 0) {
      return (
        <View style={styles.center}>
          <Icon name="document-text-outline" size={60} color="#E5E7EB" />
          <Text style={styles.message}>No policy data found.</Text>
        </View>
      );
    }

    return policyData.map((section: any, index: number) => (
      <View key={section._id || index} style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>
          {index + 1}. {section.title}
        </Text>
        <Text style={styles.sectionContent}>{section.content}</Text>
      </View>
    ));
  }, [policyData, isLoading]);

  return (
    <SafeAreaView style={styles.mainWrapper}>
      <StatusBar barStyle="dark-content" />

      {/* PROFESSIONAL HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Icon name="chevron-back" size={24} color="#1F305E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Privacy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topInfo}>
          <Text style={styles.mainHeading}>Privacy Policy</Text>
          <Text style={styles.subHeader}>Last updated: June 23, 2025</Text>
          <Text style={styles.introText}>
            Please read these terms and conditions carefully before using our
            service.
          </Text>
        </View>

        {/* CONDITIONAL RENDERING */}
        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#1F305E" />
            <Text style={styles.message}>Loading Policy...</Text>
          </View>
        ) : isError ? (
          <View style={styles.center}>
            <View style={styles.errorIconBg}>
              <Icon name="cloud-offline" size={30} color="#EF4444" />
            </View>
            <Text style={styles.errorTitle}>Connection Error</Text>
            <Text style={styles.message}>Unable to fetch policy details.</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          renderedPolicySections
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: "#F9FAFB", // Light grey background for readability
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backBtn: { width: 40, height: 40, justifyContent: "center" },
  headerTitle: {
    fontSize: RFValue(16),
    fontFamily: "bold",
    color: "#1F305E",
  },
  container: { flex: 1 },
  contentContainer: {
    padding: 20,
    paddingBottom: RFValue(40),
  },
  topInfo: {
    marginBottom: 25,
  },
  mainHeading: {
    fontSize: RFValue(22),
    fontFamily: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  subHeader: {
    fontSize: RFValue(12),
    color: "#6B7280",
    fontFamily: "medium",
    marginBottom: 12,
  },
  introText: {
    fontSize: RFValue(13),
    color: "#4B5563",
    lineHeight: 20,
    fontFamily: "medium",
  },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sectionTitle: {
    fontSize: RFValue(14),
    marginBottom: 10,
    color: "#111827",
    fontFamily: "bold",
  },
  sectionContent: {
    fontSize: RFValue(13),
    color: "#4B5563",
    lineHeight: RFValue(20),
    fontFamily: "medium",
  },
  center: {
    marginTop: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  errorIconBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  errorTitle: {
    fontSize: RFValue(15),
    color: "#111827",
    fontFamily: "bold",
  },
  message: {
    fontSize: RFValue(13),
    textAlign: "center",
    color: "#9CA3AF",
    marginTop: 8,
    fontFamily: "medium",
  },
  retryBtn: {
    marginTop: 20,
    backgroundColor: "#1F305E",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  retryText: {
    color: "#fff",
    fontSize: RFValue(13),
    fontFamily: "bold",
  },
});

export default TermsPrivacyScreen;
