import { useFaqs } from "@/hooks/useContent";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FAQItem {
  question: string;
  answer: string;
  _id: string;
}

const FAQScreen: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const { data, isError, isLoading, refetch } = useFaqs();

  const faqData: FAQItem[] = data?.faqs || [];

  const handleToggle = useCallback((index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex((prev) => (prev === index ? null : index));
  }, []);

  const renderItem = ({ item, index }: { item: FAQItem; index: number }) => {
    const isExpanded = expandedIndex === index;
    return (
      <View style={[styles.card, isExpanded && styles.activeCard]}>
        <TouchableOpacity
          onPress={() => handleToggle(index)}
          style={styles.questionRow}
          activeOpacity={0.7}
        >
          <Text style={[styles.question, isExpanded && styles.activeQuestion]}>
            {item.question}
          </Text>
          <Icon
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color={isExpanded ? "#1F305E" : "#9CA3AF"}
          />
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.answerContainer}>
            <View style={styles.divider} />
            <Text style={styles.answer}>{item.answer}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderEmptyComponent = () => {
    if (isLoading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1F305E" />
          <Text style={styles.message}>Loading FAQs...</Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.centered}>
          <View style={styles.errorIconBg}>
            <Icon name="alert-circle" size={30} color="#EF4444" />
          </View>
          <Text style={styles.errorTitle}>Oops! Failed to load</Text>
          <Text style={styles.message}>
            Check your connection and try again.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.centered}>
        <Icon name="help-circle-outline" size={60} color="#E5E7EB" />
        <Text style={styles.message}>No questions found.</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Icon name="chevron-back" size={24} color="#1F305E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.mainHeading}>Frequently Asked Questions</Text>

        <FlatList
          data={faqData}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={renderEmptyComponent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listPadding}
        />
      </View>
    </SafeAreaView>
  );
};

export default FAQScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
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
  headerTitle: { fontSize: RFValue(16), fontFamily: "bold", color: "#1F305E" },
  content: { flex: 1, paddingHorizontal: 16 },
  mainHeading: {
    fontSize: RFValue(18),
    fontFamily: "bold",
    color: "#111827",
    marginTop: 20,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  activeCard: { borderColor: "#1F305E", elevation: 2, shadowOpacity: 0.05 },
  questionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  question: {
    fontSize: RFValue(13),
    fontFamily: "demiBold",
    color: "#374151",
    flex: 1,
    paddingRight: 10,
  },
  activeQuestion: { color: "#1F305E" },
  answerContainer: { paddingHorizontal: 16, paddingBottom: 16 },
  divider: { height: 1, backgroundColor: "#F3F4F6", marginBottom: 12 },
  answer: {
    fontSize: RFValue(12),
    color: "#6B7280",
    fontFamily: "medium",
    lineHeight: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
  },
  message: {
    fontSize: RFValue(13),
    color: "#9CA3AF",
    marginTop: 10,
    fontFamily: "medium",
  },
  errorIconBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
  },
  errorTitle: {
    fontSize: RFValue(15),
    fontFamily: "bold",
    color: "#111827",
    marginTop: 15,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: "#1F305E",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  retryText: { color: "#fff", fontSize: RFValue(13), fontFamily: "bold" },
  listPadding: { paddingBottom: 40 },
});
