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
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

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
  const insets = useSafeAreaInsets();
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
      <View style={[styles.accordionCard, isExpanded && styles.activeCard]}>
        <TouchableOpacity
          onPress={() => handleToggle(index)}
          style={styles.questionRow}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.questionText,
              isExpanded && styles.activeQuestionText,
            ]}
          >
            {item.question}
          </Text>
          <View
            style={[styles.iconCircle, isExpanded && styles.activeIconCircle]}
          >
            <Ionicons
              name={isExpanded ? "remove" : "add"}
              size={18}
              color={isExpanded ? "#FFF" : "#94A3B8"}
            />
          </View>
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.answerWrapper}>
            <Text style={styles.answerText}>{item.answer}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.navBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#1F305E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FAQs</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={faqData}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator style={{ marginTop: 40 }} color="#73C2FB" />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="alert-circle-outline" size={48} color="#CBD5E1" />
              <Text style={styles.emptyText}>
                {isError ? "Connection Error" : "No questions available"}
              </Text>
              {isError && (
                <TouchableOpacity
                  style={styles.retryBtn}
                  onPress={() => refetch()}
                >
                  <Text style={styles.retryBtnText}>Retry</Text>
                </TouchableOpacity>
              )}
            </View>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#FFFFFF" },
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
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#1F305E" },
  listContent: { padding: 20, paddingBottom: 40 },
  accordionCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "#F1F5F9",
    overflow: "hidden",
  },
  activeCard: { borderColor: "#73C2FB", backgroundColor: "#F8FAFC" },
  questionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
  },
  questionText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F305E",
    flex: 1,
    paddingRight: 10,
  },
  activeQuestionText: { fontWeight: "700" },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  activeIconCircle: { backgroundColor: "#73C2FB" },
  answerWrapper: { paddingHorizontal: 18, paddingBottom: 18 },
  answerText: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 22,
    fontWeight: "500",
  },
  emptyContainer: { alignItems: "center", marginTop: 60 },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#94A3B8",
    fontWeight: "600",
  },
  retryBtn: {
    marginTop: 20,
    backgroundColor: "#1F305E",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  retryBtnText: { color: "#FFF", fontWeight: "700" },
});

export default FAQScreen;
