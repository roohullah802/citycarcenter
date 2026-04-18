import { useFaqs } from "@/hooks/useContent";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface FAQItem {
  question: string;
  answer: string;
  createdAt: Date;
  updatedAt: Date;
  _id: string;
}

const FAQScreen: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const { data, isError, isLoading, refetch } = useFaqs();

  const faqData: FAQItem[] = data?.faqs || [];

  const handleToggle = useCallback((index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: FAQItem; index: number }) => (
      <View style={styles.card}>
        <TouchableOpacity
          onPress={() => handleToggle(index)}
          style={styles.questionRow}
          activeOpacity={0.7}
        >
          <Text style={styles.question}>{item.question}</Text>
          <Text style={styles.toggle}>
            {expandedIndex === index ? "−" : "+"}
          </Text>
        </TouchableOpacity>
        {expandedIndex === index && (
          <Text style={styles.answer}>{item.answer}</Text>
        )}
      </View>
    ),
    [expandedIndex, handleToggle],
  );

  const renderEmptyComponent = () => {
    if (isLoading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#73C2FB" />
          <Text style={styles.message}>Loading FAQs...</Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.centered}>
          <Icon name="alert-circle" size={40} color="red" />
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.message}>We couldn’t load the FAQs.</Text>
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
        <Icon name="information-circle-outline" size={40} color="#ccc" />
        <Text style={styles.message}>No FAQs available at the moment.</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Icon name="chevron-back" size={24} color="#1F305E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FAQs</Text>
      </View>

      <Text style={styles.mainHeading}>Frequently Asked Questions (FAQs)</Text>

      <FlatList
        data={faqData}
        renderItem={renderItem}
        keyExtractor={(item, index) => item._id || index.toString()}
        ListEmptyComponent={renderEmptyComponent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          faqData.length === 0 ? styles.fullHeight : styles.listSpacing
        }
      />
    </View>
  );
};

export default FAQScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    // Unified padding for Android/iOS status bars
    paddingTop: Platform.OS === "android" ? 40 : 50,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    position: "relative",
    marginBottom: 20,
  },
  iconBtn: {
    position: "absolute",
    left: 0,
    zIndex: 10,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "bold",
    color: "#000",
    textAlign: "center",
  },
  mainHeading: {
    fontSize: 14,
    fontFamily: "demiBold",
    color: "#3f3f3fff",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  questionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  question: {
    fontSize: 15,
    flex: 1,
    fontFamily: "demiBold",
    color: "#3f3f3fff",
  },
  toggle: {
    fontSize: 20,
    paddingLeft: 10,
    color: "#3f3f3fff",
  },
  answer: {
    marginTop: 10,
    fontSize: 13,
    color: "#555",
    fontFamily: "medium",
    lineHeight: 18,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100, // Pushes loader to center of screen space
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
    backgroundColor: "#3f3f3fff",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "demiBold",
  },
  fullHeight: {
    flexGrow: 1,
    justifyContent: "center",
  },
  listSpacing: {
    paddingBottom: 30,
  },
});
