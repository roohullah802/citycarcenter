import CarCards from "@/components/CarCards";
import { router } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
} from "react-native";
import { Modalize } from "react-native-modalize";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import BottomSheetFilterModal from "./BottomSheetFilterModel";
import { useCars } from "@/hooks/useFetchCars";
import { useFavorites } from "@/context/FavoutiteContext";

interface Car {
  modelName: string;
  price: number;
  pricePerDay: number;
  images: { url: string; fileId: string }[];
  brandImage: string;
  totalReviews: number;
  brand: string;
  _id: string;
}

const SearchCarCards = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([1, 1000]);
  const { favouriteIds } = useFavorites();

  const ref = useRef<Modalize>(null);
  const { data, isLoading, isError, refetch } = useCars();

  const filteredCars = useMemo(() => {
    const allCars = data?.data || [];
    return allCars.filter((car: Car) => {
      const matchesSearch = car.modelName
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchesBrand = selectedBrand
        ? car.brand.toLowerCase() === selectedBrand.toLowerCase()
        : true;
      const matchesPrice =
        car.pricePerDay >= priceRange[0] && car.pricePerDay <= priceRange[1];

      return matchesSearch && matchesBrand && matchesPrice;
    });
  }, [data?.data, searchText, selectedBrand, priceRange]);

  // --- 1. LOADING STATE ---
  if (isLoading) {
    return (
      <View style={styles.centerWrapper}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color="#73C2FB" />
        <Text style={styles.loadingText}>Curating your collection...</Text>
      </View>
    );
  }

  // --- 2. ERROR STATE ---
  if (isError) {
    return (
      <View style={styles.centerWrapper}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.errorIconCircle}>
          <Ionicons name="cloud-offline-outline" size={40} color="#EF4444" />
        </View>
        <Text style={styles.emptyTitle}>Connection Interrupted</Text>
        <Text style={styles.emptySubtitle}>
          We couldn&apos;t retrieve the fleet data. Please check your internet
          connection.
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.retryBtn}
          onPress={() => refetch()}
        >
          <Text style={styles.retryBtnText}>Retry Now</Text>
          <Ionicons
            name="refresh-outline"
            size={18}
            color="#FFF"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={28} color="#1F305E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Available Fleet</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* SEARCH & FILTER SECTION */}
        <View style={styles.searchSection}>
          <View style={styles.searchBarWrapper}>
            <Ionicons name="search-outline" size={20} color="#94A3B8" />
            <TextInput
              placeholder="Search model, e.g. 'Civic'..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#94A3B8"
              style={styles.searchInput}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.filterToggle,
              !!selectedBrand && styles.filterToggleActive,
            ]}
            onPress={() => ref.current?.open()}
          >
            <Ionicons
              name="options-outline"
              size={22}
              color={selectedBrand ? "#FFF" : "#1F305E"}
            />
            {selectedBrand && <View style={styles.activeFilterIndicator} />}
          </TouchableOpacity>
        </View>

        {/* RESULTS SECTION */}
        {filteredCars?.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="car-sport-outline" size={40} color="#CBD5E1" />
            </View>
            <Text style={styles.emptyTitle}>No Matches Found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your filters or search terms.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSearchText("");
                setSelectedBrand(null);
                setPriceRange([1, 1000]);
              }}
              style={styles.resetButton}
            >
              <Text style={styles.resetButtonText}>Clear All Filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredCars}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <CarCards item={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            extraData={favouriteIds}
            refreshing={isLoading}
            onRefresh={refetch} // Pull-to-refresh integration
          />
        )}

        <BottomSheetFilterModal
          setPriceRange={setPriceRange}
          priceRange={priceRange}
          ref={ref}
          onClose={() => ref.current?.close()}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  centerWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: "#F1F5F9",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F305E",
    letterSpacing: -0.5,
  },
  searchSection: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    gap: 12,
  },
  searchBarWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 54,
    borderWidth: 1.5,
    borderColor: "#F1F5F9",
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "600",
    color: "#1F305E",
  },
  filterToggle: {
    width: 54,
    height: 54,
    backgroundColor: "#FFF",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  filterToggleActive: { backgroundColor: "#1F305E", borderColor: "#1F305E" },
  activeFilterIndicator: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#73C2FB",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  listContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: "600",
    color: "#94A3B8",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 80,
  },
  emptyIconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  errorIconCircle: {
    width: 84,
    height: 84,
    borderRadius: 20,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1F305E",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 20,
  },
  resetButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
  },
  resetButtonText: { fontSize: 14, fontWeight: "700", color: "#1F305E" },
  retryBtn: {
    marginTop: 24,
    backgroundColor: "#1F305E",
    height: 54,
    borderRadius: 16,
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#1F305E",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  retryBtnText: { color: "#FFF", fontSize: 15, fontWeight: "700" },
});

export default SearchCarCards;
