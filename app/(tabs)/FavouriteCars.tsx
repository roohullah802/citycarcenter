import FavCars from "@/components/FavCars";
import { useFetchFavourites } from "@/hooks/useFavourites";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/utils/Colors";
import { GlobalStyles } from "@/utils/GlobalStyles";

const FavouriteCars: React.FC = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState("");

  const { data: favouritesData, isLoading: isFavLoading, isError: isFavError } = useFetchFavourites();
  const { data: carsData, isLoading: isCarsLoading } = useCars();

  const favouriteIds = favouritesData?.carIds || [];
  console.log(favouriteIds);


  const favouriteCarsData = useMemo(() => {
    const allCars = carsData?.data || [];
    const favs = allCars.filter((car: any) => favouriteIds.includes(car?._id));

    if (!searchText.trim()) return favs;

    return favs.filter(
      (car: any) =>
        car.modelName?.toLowerCase().includes(searchText.toLowerCase()) ||
        car.brand?.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [carsData, favouriteIds, searchText]);

  if (isFavLoading || isCarsLoading) {
    return (
      <View style={[GlobalStyles.surface, GlobalStyles.center]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading your collection...</Text>
      </View>
    );
  }

  if (isFavError) {
    return (
      <View style={[GlobalStyles.surface, GlobalStyles.center]}>
        <Ionicons name="alert-circle-outline" size={42} color={Colors.danger} />
        <Text style={styles.loadingText}>Error loading favorites</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: Colors.primary }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <StatusBar barStyle="dark-content" />

      {/* REFINED DYNAMIC HEADER */}
      <View style={styles.header}>
        {!isSearching ? (
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.navBtn}
            >
              <Ionicons name="chevron-back" size={28} color={Colors.primary} />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>My Favorites</Text>

            <TouchableOpacity
              onPress={() => setIsSearching(true)}
              style={styles.navBtn}
            >
              <Ionicons name="search-outline" size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.searchRow}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={18} color="#94A3B8" />
              <TextInput
                placeholder="Search favorite models..."
                value={searchText}
                onChangeText={setSearchText}
                autoFocus
                style={styles.searchInput}
                placeholderTextColor={Colors.muted}
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText("")}>
                  <Ionicons name="close-circle" size={18} color="#94A3B8" />
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
          <View style={styles.emptyWrapper}>
            <View style={styles.emptyIconBox}>
              <Ionicons
                name={searchText ? "search-outline" : "heart-dislike-outline"}
                size={42}
                color="#CBD5E1"
              />
            </View>
            <Text style={styles.emptyTitle}>
              {searchText ? "No matches found" : "Collection is empty"}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchText
                ? "We couldn't find any favorites matching your search term."
                : "Save your favorite vehicles to access them quickly here."}
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
    backgroundColor: "#FFFFFF",
  },
  centerWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
    color: "#94A3B8",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  navBtn: {
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
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1.5,
    borderColor: "#F1F5F9",
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "rgba(31, 48, 94, 0.88)",
    fontWeight: "600",
    marginLeft: 8,
  },
  cancelBtn: {
    paddingHorizontal: 4,
  },
  cancelText: {
    color: "#EF4444",
    fontWeight: "700",
    fontSize: 14,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  emptyWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingBottom: 60,
  },
  emptyIconBox: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "rgba(31, 48, 94, 0.88)",
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
    fontWeight: "500",
  },
});
