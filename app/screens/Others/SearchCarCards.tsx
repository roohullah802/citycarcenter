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
import Icon from "react-native-vector-icons/Ionicons";
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

  const openFilterModal = () => ref.current?.open();
  const onClose = () => ref.current?.close();

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#73C2FB" />
        <Text style={styles.loadingText}>Finding best rides...</Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Icon name="cloud-offline-outline" size={50} color="#FF6B6B" />
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryBtnText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.back()}
          >
            <Icon name="arrow-back" size={24} color="#1F305E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Available Cars</Text>
          <View style={styles.iconBtn} />
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Icon name="search-outline" size={20} color="#999" />
            <TextInput
              placeholder="Search by model..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#999"
              style={styles.searchInput}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.filterBtn,
              !!selectedBrand && styles.filterBtnActive,
            ]}
            onPress={openFilterModal}
          >
            <Icon
              name="options-outline"
              size={22}
              color={selectedBrand ? "#fff" : "#73C2FB"}
            />
            {selectedBrand ? <View style={styles.dot} /> : null}
          </TouchableOpacity>
        </View>

        {filteredCars?.length === 0 ? (
          <View style={styles.noData}>
            <Icon name="car-outline" size={60} color="#E5E4E2" />
            <Text style={styles.noDataText}>No cars match your criteria</Text>
            <TouchableOpacity
              onPress={() => {
                setSearchText("");
                setSelectedBrand(null);
                setPriceRange([1, 1000]);
              }}
            >
              <Text style={styles.clearFilters}>Clear all filters</Text>
            </TouchableOpacity>
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

        <BottomSheetFilterModal
          setPriceRange={setPriceRange}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          priceRange={priceRange}
          ref={ref}
          onClose={onClose}
        />
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "bold",
    color: "#3f3f3fff",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
    marginTop: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 15,
    color: "#333",
    fontFamily: "demiBold",
  },
  filterBtn: {
    width: 50,
    height: 50,
    backgroundColor: "#eef8ff",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  filterBtnActive: {
    backgroundColor: "#73C2FB",
  },
  dot: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF6B6B",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  listContainer: {
    paddingBottom: 30,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 15,
    fontFamily: "medium",
    color: "#73C2FB",
  },
  errorTitle: {
    fontSize: 16,
    fontFamily: "bold",
    color: "#333",
    marginTop: 10,
  },
  retryBtn: {
    marginTop: 20,
    backgroundColor: "#73C2FB",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryBtnText: {
    color: "#fff",
    fontFamily: "bold",
  },
  noData: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  noDataText: {
    fontFamily: "demiBold",
    marginTop: 15,
    fontSize: 16,
    color: "#999",
  },
  clearFilters: {
    color: "#73C2FB",
    fontFamily: "bold",
    marginTop: 10,
  },
});

export default SearchCarCards;
