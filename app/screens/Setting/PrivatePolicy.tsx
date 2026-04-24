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
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const TermsPrivacyScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { data, isError, isLoading, refetch } = usePolicy();

  const policyData = useMemo(() => data?.policy || [], [data]);

  return (
    <View style={styles.mainWrapper}>
      <StatusBar barStyle="dark-content" />

      {/* PROFESSIONAL HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.navBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="rgba(31, 48, 94, 0.88)" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Legal</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO SECTION */}
        <View style={styles.heroSection}>
          <Text style={styles.mainTitle}>Terms & Privacy</Text>
          <View style={styles.updateBadge}>
            <Text style={styles.updateText}>LAST UPDATED: JUNE 23, 2025</Text>
          </View>
          <Text style={styles.introText}>
            These guidelines outline the rules and regulations for the use of
            City Car Center&apos;s platform and services.
          </Text>
        </View>

        {/* CONTENT LOGIC */}
        {isLoading ? (
          <View style={styles.centerWrapper}>
            <ActivityIndicator size="large" color="rgba(31, 48, 94, 0.88)" />
            <Text style={styles.statusText}>Loading document...</Text>
          </View>
        ) : isError ? (
          <View style={styles.centerWrapper}>
            <Ionicons name="cloud-offline-outline" size={48} color="#EF4444" />
            <Text style={styles.errorTitle}>Connection Failed</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
              <Text style={styles.retryBtnText}>Reload Policy</Text>
            </TouchableOpacity>
          </View>
        ) : (
          policyData.map((section: any, index: number) => (
            <View key={section._id || index} style={styles.policyCard}>
              <Text style={styles.sectionHeading}>
                {index + 1}. {section.title}
              </Text>
              <Text style={styles.sectionContent}>{section.content}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  navBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "rgba(31, 48, 94, 0.88)",
  },
  container: { flex: 1 },
  contentContainer: {
    padding: 24,
    paddingBottom: 60,
  },
  heroSection: {
    marginBottom: 32,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "rgba(31, 48, 94, 0.88)",
    letterSpacing: -0.5,
  },
  updateBadge: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  updateText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 1,
  },
  introText: {
    fontSize: 15,
    color: "#64748B",
    lineHeight: 24,
    fontWeight: "500",
  },
  policyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...Platform.select({
      ios: {
        shadowColor: "rgba(31, 48, 94, 0.88)",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: { elevation: 2 },
    }),
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "800",
    color: "rgba(31, 48, 94, 0.88)",
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
    fontWeight: "500",
  },
  centerWrapper: {
    marginTop: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  statusText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
    color: "#94A3B8",
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "rgba(31, 48, 94, 0.88)",
    marginTop: 12,
  },
  retryBtn: {
    marginTop: 20,
    backgroundColor: "rgba(31, 48, 94, 0.88)",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 14,
  },
  retryBtnText: {
    color: "#FFF",
    fontWeight: "700",
  },
});

export default TermsPrivacyScreen;
