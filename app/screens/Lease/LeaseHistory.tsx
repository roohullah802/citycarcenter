import LeaseCard from "@/components/LeaseCard";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export default function LeaseHistoryScreen() {
  const { width } = useWindowDimensions();
  const isTablet = useMemo(() => width >= 768, [width]);

  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [leases] = useState([]);
  const isLoading = false;

  const filteredLeases = useMemo(() => {
    if (!query.trim()) return leases;
    return leases.filter((lease: any) => {
      const model = lease.carDetails?.[0]?.modelName?.toLowerCase() ?? "";
      const brand = lease.carDetails?.[0]?.brand?.toLowerCase() ?? "";
      return (
        model.includes(query.toLowerCase()) ||
        brand.includes(query.toLowerCase())
      );
    });
  }, [leases, query]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedId((cur) => (cur === id ? null : id));
  }, []);

  const numColumns = isTablet ? 2 : 1;

  return (
    <View style={styles.mainContainer}>
      {/* --- TOP HEADER SECTION --- */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={RFValue(22)} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lease History</Text>
        <View style={{ width: RFValue(40) }} />
      </View>

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.subtitle}>
            Track and manage all lease agreements
          </Text>
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchBox}>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search leases by car model or brand"
              placeholderTextColor={"#6b7280"}
              style={styles.searchInput}
              returnKeyType="search"
            />
            <TouchableOpacity style={styles.searchBtn}>
              <Text style={styles.searchBtnText}>Go</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.listWrap}>
          {isLoading ? (
            <View style={styles.centered}>
              <Text style={styles.loadingText}>Loading leases...</Text>
            </View>
          ) : filteredLeases.length === 0 ? (
            <View style={styles.centered}>
              <Text style={styles.loadingText}>
                {query
                  ? "No leases found for your search."
                  : "No leases available."}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredLeases}
              renderItem={({ item }) => (
                <LeaseCard
                  item={item}
                  toggleExpand={toggleExpand}
                  isTablet={isTablet}
                  expandedId={expandedId}
                />
              )}
              numColumns={numColumns}
              key={isTablet ? "tablet" : "mobile"}
              columnWrapperStyle={
                isTablet ? { justifyContent: "space-between" } : undefined
              }
              contentContainerStyle={{ paddingBottom: 40 }}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#f9fafb" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingTop: Platform.OS === "ios" ? RFValue(45) : RFValue(35),
    paddingBottom: 15,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  headerTitle: {
    fontSize: RFValue(16),
    fontFamily: "bold",
    color: "#1A1A1A",
  },
  backBtn: {
    width: 40,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 15,
  },
  header: { marginBottom: 20 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#3f3f3fff",
    fontFamily: "bold",
  },
  subtitle: { fontSize: 14, color: "#6b7280", marginTop: 4 },

  searchSection: { marginBottom: 16 },
  searchBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 12, paddingVertical: 6 },
  searchBtn: {
    marginLeft: 8,
    backgroundColor: "#0ea5e9",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  searchBtnText: { color: "#fff", fontWeight: "600", fontFamily: "bold" },

  listWrap: { flex: 1 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: { marginTop: 10, color: "#6b7280", fontFamily: "demiBold" },
});
