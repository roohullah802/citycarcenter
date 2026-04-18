import CarCards from "@/components/CarCards";
import { useFavorites } from "@/context/FavoutiteContext";
import { useCars } from "@/hooks/useFetchCars";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

const CarCardsByBrand = () => {
  const [searchText, setSearchText] = useState<string>("");
  const { brand } = useLocalSearchParams<{ brand: string }>();
  const { favouriteIds } = useFavorites();

  // Fetch live data from your hook
  const { data, isLoading, isError, refetch } = useCars();
  const cars = data?.data;

  // Optimized Filtering logic
  const filteredCars = useMemo(() => {
    if (!cars) return [];
    return cars.filter((item: any) => {
      const matchesSearch = item.modelName
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchesBrand = item.brand.toLowerCase() === brand?.toLowerCase();
      return matchesSearch && matchesBrand;
    });
  }, [searchText, brand, cars]);

  // 1. Loading State UI
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#73C2FB" />
        <Text style={styles.loadingText}>Loading {brand} fleet...</Text>
      </SafeAreaView>
    );
  }

  // 2. Error State UI
  if (isError) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Icon name="cloud-offline-outline" size={50} color="#FF6B6B" />
        <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryBtnText}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        {/* IMPROVED CENTERED HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Icon name="arrow-back" size={24} color="#1F305E" />
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>{brand || "All Cars"}</Text>
            {filteredCars.length > 0 && (
              <Text style={styles.carCount}>
                {filteredCars.length} models available
              </Text>
            )}
          </View>

          <View style={styles.placeholder} />
        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Icon name="search-outline" size={20} color="#999" />
            <TextInput
              placeholder={`Search ${brand || "car"} model...`}
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#999"
              style={styles.searchInput}
            />
            {searchText !== "" && (
              <TouchableOpacity onPress={() => setSearchText("")}>
                <Icon name="close-circle" size={18} color="#ccc" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* LIST OR EMPTY STATE */}
        {filteredCars.length === 0 ? (
          <View style={styles.noData}>
            <Icon name="car-outline" size={80} color="#F0F0F0" />
            <Text style={styles.noDataText}>No {brand} cars found</Text>
            <Text style={styles.noDataSubText}>
              Try searching for a different model name.
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredCars}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => <CarCards item={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            extraData={favouriteIds}
          />
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerTitleContainer: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "bold",
    color: "#1F305E",
    textTransform: "capitalize",
  },
  carCount: {
    fontSize: 10,
    color: "#73C2FB",
    fontFamily: "medium",
    marginTop: 2,
  },
  placeholder: {
    width: 40,
  },
  searchRow: {
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7F9",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 15,
    color: "#333",
    fontFamily: "demiBold",
  },
  loadingText: {
    marginTop: 12,
    color: "#73C2FB",
    fontFamily: "medium",
  },
  errorTitle: {
    fontFamily: "bold",
    fontSize: 16,
    marginTop: 15,
    color: "#333",
  },
  retryBtn: {
    marginTop: 20,
    backgroundColor: "#1F305E",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryBtnText: {
    color: "#fff",
    fontFamily: "bold",
    fontSize: 14,
  },
  noData: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  noDataText: {
    fontFamily: "bold",
    marginTop: 10,
    fontSize: 18,
    color: "#333",
  },
  noDataSubText: {
    fontFamily: "medium",
    fontSize: 14,
    color: "#999",
    marginTop: 5,
  },
  listContainer: {
    paddingBottom: 30,
  },
});

export default CarCardsByBrand;
