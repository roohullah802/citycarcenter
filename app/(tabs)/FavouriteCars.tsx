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
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";

const FavouriteCars: React.FC = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState("");

  const { favouriteIds } = useFavorites();
  const { data, isLoading } = useCars();

  const searchAnim = useRef(new Animated.Value(0)).current;

  const favouriteCarsData = useMemo(() => {
    const allCars = data?.data || [];
    const favs = allCars.filter((car: any) => favouriteIds.includes(car?._id));

    if (!searchText.trim()) return favs;

    return favs.filter(
      (car: any) =>
        car.modelName.toLowerCase().includes(searchText.toLowerCase()) ||
        car.brand.toLowerCase().includes(searchText.toLowerCase()),
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
      <View style={styles.header}>
        {!isSearching ? (
          <>
            <TouchableOpacity onPress={() => router.back()}>
              <Icon name="chevron-back" size={24} color="#1F305E" />
            </TouchableOpacity>

            <Text style={styles.headerText}>Favourite Cars</Text>

            <TouchableOpacity onPress={handleSearchToggle}>
              <Icon name="search" size={24} color="#1F305E" />
            </TouchableOpacity>
          </>
        ) : (
          <Animated.View
            style={{
              width: searchAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#f5f5f5",
              borderRadius: 10,
              paddingHorizontal: 10,
              height: 45,
            }}
          >
            <TextInput
              placeholder="Search cars..."
              value={searchText}
              onChangeText={setSearchText}
              autoFocus
              style={{ flex: 1, height: "100%" }}
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
        extraData={favouriteIds} // Important for instant heart-icon updates
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="heart-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No favorite cars found</Text>
          </View>
        }
        // This makes the empty component fill the center of the screen
        contentContainerStyle={
          favouriteCarsData.length === 0 ? { flex: 1 } : { paddingBottom: 20 }
        }
      />
    </View>
  );
};

export default FavouriteCars;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? 40 : 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: 60,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3f3f3fff",
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
    marginTop: -80,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 10,
    fontWeight: "500",
  },
});
