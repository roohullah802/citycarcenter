import { usePolicy } from "@/hooks/useContent";
import { router } from "expo-router";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

const TermsPrivacyScreen: React.FC = () => {
  const { data, isError, isLoading, refetch } = usePolicy();

  const policyData = data?.policy || [];

  const renderedPolicySections = useMemo(() => {
    if (!isLoading && policyData.length === 0) {
      return (
        <View style={styles.centeredInternal}>
          <Text style={styles.message}>No policy data found.</Text>
        </View>
      );
    }

    return policyData.map((section: any, index: number) => (
      <View key={section._id || index} style={styles.section}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <Text style={styles.sectionContent}>{section.content}</Text>
      </View>
    ));
  }, [policyData, isLoading]);

  return (
    <View style={styles.mainWrapper}>
      {/* HEADER SECTION - Kept outside ScrollView so it's always visible */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Icon name="chevron-back" size={24} color="#1F305E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subHeader}>Last updated: June 23, 2025</Text>

        {/* CONDITIONAL RENDERING FOR CONTENT */}
        {isLoading ? (
          <View style={styles.centeredInternal}>
            <ActivityIndicator size="large" color="#73C2FB" />
            <Text style={styles.message}>Loading Policy...</Text>
          </View>
        ) : isError ? (
          <View style={styles.centeredInternal}>
            <Icon name="alert-circle" size={40} color="red" />
            <Text style={styles.errorTitle}>Network Error</Text>
            <Text style={styles.message}>We couldn’t load the policies.</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => refetch()}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          renderedPolicySections
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: "#fff",
    // Proper status bar padding
    paddingTop: Platform.OS === "android" ? 40 : 50,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: width * 0.05,
    paddingBottom: RFValue(40),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    position: "relative",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  iconBtn: {
    position: "absolute",
    left: 20,
    zIndex: 10,
    padding: 4,
  },
  headerTitle: {
    fontSize: RFValue(16),
    fontFamily: "bold",
    color: "#000",
    textAlign: "center",
  },
  mainHeading: {
    fontSize: RFValue(14),
    fontFamily: "demiBold",
    color: "#3f3f3fff",
    marginBottom: 4,
  },
  subHeader: {
    fontSize: RFValue(12),
    color: "#888",
    marginBottom: RFValue(25),
    fontFamily: "medium",
  },
  section: {
    marginBottom: RFValue(25),
  },
  sectionTitle: {
    fontSize: RFValue(15),
    marginBottom: RFValue(8),
    color: "#111",
    fontFamily: "bold",
  },
  sectionContent: {
    fontSize: RFValue(13),
    color: "#555",
    lineHeight: RFValue(20),
    fontFamily: "medium",
  },
  centeredInternal: {
    marginTop: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  errorTitle: {
    fontSize: 18,
    marginTop: 10,
    color: "red",
    fontFamily: "bold",
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginTop: 8,
    fontFamily: "medium",
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "demiBold",
  },
});

export default TermsPrivacyScreen;
