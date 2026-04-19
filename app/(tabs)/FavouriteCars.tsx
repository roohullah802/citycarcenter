import FavCars from "@/components/FavCars";
import { useFavorites } from "@/context/FavoutiteContext";
import { useCars } from "@/hooks/useFetchCars";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  StatusBar,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

const FavouriteCars: React.FC = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState("");

  const { favouriteIds } = useFavorites();
  const { data, isLoading } = useCars();

  const favouriteCarsData = useMemo(() => {
    const allCars = data?.data || [];
    const favs = allCars.filter((car: any) => favouriteIds.includes(car?._id));

    if (!searchText.trim()) return favs;

    return favs.filter(
      (car: any) =>
        car.modelName?.toLowerCase().includes(searchText.toLowerCase()) ||
        car.brand?.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [data, favouriteIds, searchText]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1F305E" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Dynamic Header */}
      <View style={styles.header}>
        {!isSearching ? (
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.iconBtn}
            >
              <Icon name="chevron-back" size={24} color="#1F305E" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Favorites</Text>
            <TouchableOpacity
              onPress={() => setIsSearching(true)}
              style={styles.iconBtn}
            >
              <Icon name="search-outline" size={24} color="#1F305E" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.searchRow}>
            <View style={styles.searchBar}>
              <Icon
                name="search"
                size={18}
                color="#9CA3AF"
                style={{ marginRight: 8 }}
              />
              <TextInput
                placeholder="Search your favorites..."
                value={searchText}
                onChangeText={setSearchText}
                autoFocus
                style={styles.searchInput}
                placeholderTextColor="#9CA3AF"
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText("")}>
                  <Icon name="close-circle" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              onPress={() => {
                setIsSearching(false);
                setSearchText("");
              }}
              style={styles.cancelBtn}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <FlatList
        data={favouriteCarsData}
        renderItem={({ item }) => <FavCars item={item} />}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Icon
                name={searchText ? "search" : "heart-outline"}
                size={40}
                color="#1F305E"
              />
            </View>
            <Text style={styles.emptyTitle}>
              {searchText ? "No matches found" : "No favorites yet"}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchText
                ? "Try searching for a different brand or model."
                : "Tap the heart icon on any car to save it here."}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default FavouriteCars;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: RFValue(16),
    fontFamily: "bold",
    color: "#1F305E",
  },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: RFValue(13),
    color: "#1F2937",
    fontFamily: "medium",
  },
  cancelBtn: {
    paddingVertical: 8,
  },
  cancelText: {
    color: "#EF4444",
    fontFamily: "bold",
    fontSize: RFValue(13),
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: RFValue(16),
    fontFamily: "bold",
    color: "#1F2937",
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: RFValue(12),
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
    fontFamily: "medium",
  },
});
