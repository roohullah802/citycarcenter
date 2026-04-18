import FavCars from "@/components/FavCars";
import { useFavorites } from "@/context/FavoutiteContext";
import { useCars } from "@/hooks/useFetchCars";
import { router } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList, // Standard RN FlatList is usually safer for contentContainerStyle
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const FavouriteCars: React.FC = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState("");

  const { favouriteIds } = useFavorites();
  const { data, isLoading } = useCars();

  const searchAnim = useRef(new Animated.Value(0)).current;

  const favouriteCarsData = useMemo(() => {
    // Ensuring we handle nested data structure correctly
    const allCars = data?.data || [];

    // Step 1: Filter live cars that are in our favorites list
    // This automatically ignores IDs of cars deleted by Admin
    const favs = allCars.filter((car: any) => favouriteIds.includes(car?._id));

    if (!searchText.trim()) return favs;

    // Step 2: Apply Search
    return favs.filter(
      (car: any) =>
        car.modelName?.toLowerCase().includes(searchText.toLowerCase()) ||
        car.brand?.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [data, favouriteIds, searchText]);

  const handleSearchToggle = () => {
    if (!isSearching) {
      setIsSearching(true);
      Animated.timing(searchAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      setIsSearching(false);
      setSearchText("");
      Animated.timing(searchAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#73C2FB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        {!isSearching ? (
          <>
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="chevron-back" size={24} color="#1F305E" />
            </TouchableOpacity>

            <Text style={styles.headerText}>Favourite Cars</Text>

            <TouchableOpacity
              onPress={handleSearchToggle}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="search" size={24} color="#1F305E" />
            </TouchableOpacity>
          </>
        ) : (
          <Animated.View
            style={[
              styles.searchBarContainer,
              {
                width: searchAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          >
            <TextInput
              placeholder="Search cars..."
              value={searchText}
              onChangeText={setSearchText}
              autoFocus
              style={styles.searchInput}
            />
            <TouchableOpacity onPress={handleSearchToggle}>
              <Icon name="close" size={22} color="#1F305E" />
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>

      <FlatList
        data={favouriteCarsData}
        renderItem={({ item }) => <FavCars item={item} />}
        keyExtractor={(item) => item._id}
        extraData={favouriteIds}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="heart-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchText ? "No matches found" : "No favorite cars found"}
            </Text>
          </View>
        }
        contentContainerStyle={
          favouriteCarsData.length === 0 ? { flex: 1 } : { paddingBottom: 30 }
        }
      />
    </View>
  );
};

export default FavouriteCars;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? 40 : 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: 50,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3f3f3fff",
    textAlign: "center",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 45,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#333",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -50,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 10,
    fontWeight: "500",
  },
});
