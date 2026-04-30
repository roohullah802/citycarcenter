import CarCards from "@/components/CarCards";
import { useFetchFavourites } from "@/hooks/useFavourites";
import { useCars } from "@/hooks/useFetchCars";
import { Colors } from "@/utils/Colors";
import { GlobalStyles } from "@/utils/GlobalStyles";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CarCardsByBrand = () => {
  const [searchText, setSearchText] = useState<string>("");
  const { brand } = useLocalSearchParams<{ brand: string }>();
  const { data: favouritesData } = useFetchFavourites();
  const favouriteIds = favouritesData?.carIds || [];

  const { data, isLoading, isError, refetch } = useCars();
  const cars = data?.data;

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

  if (isLoading) {
    return (
      <View style={[GlobalStyles.surface, GlobalStyles.center]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.statusText}>Accessing {brand} inventory...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[GlobalStyles.surface, GlobalStyles.center, { paddingHorizontal: 40 }]}>
        <Ionicons name="cloud-offline-outline" size={50} color={Colors.danger} />
        <Text style={styles.errorTitle}>Connection Failed</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry Now</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={GlobalStyles.container}>
        <StatusBar barStyle="dark-content" />

        {/* REFINED PROFESSIONAL HEADER */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.navBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color={Colors.primary} />
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text style={GlobalStyles.headerTitle}>{brand}</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>
                {filteredCars.length} Available
              </Text>
            </View>
          </View>

          <View style={{ width: 40 }} />
        </View>

        {/* MODERN SEARCH BAR */}
        <View style={styles.searchSection}>
          <View style={[GlobalStyles.inputBox, { backgroundColor: Colors.surface, height: 52, borderRadius: 14 }]}>
            <Ionicons name="search-outline" size={20} color={Colors.muted} />
            <TextInput
              placeholder={`Explore ${brand} collection...`}
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor={Colors.muted}
              style={styles.searchInput}
            />
            {searchText !== "" && (
              <TouchableOpacity onPress={() => setSearchText("")}>
                <Ionicons name="close-circle" size={18} color={Colors.muted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* LIST SECTION */}
        {filteredCars.length === 0 ? (
          <View style={styles.emptyWrapper}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="car-sport-outline" size={48} color="#CBD5E1" />
            </View>
            <Text style={styles.emptyTitle}>No Models Found</Text>
            <Text style={styles.emptySubtitle}>
              We couldn&apos;t find any {brand} models matching &quot;
              {searchText}&quot;.
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredCars}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => <CarCards item={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={6}
            removeClippedSubviews={true}
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
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  navBtn: {
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
    fontWeight: "800",
    color: "rgba(31, 48, 94, 0.88)",
    textTransform: "capitalize",
    letterSpacing: -0.5,
  },
  countBadge: {
    backgroundColor: "#F0F9FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },
  countText: {
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(31, 48, 94, 0.88)",
    textTransform: "uppercase",
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1.5,
    borderColor: "#F1F5F9",
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "600",
    color: "rgba(31, 48, 94, 0.88)",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  centerWrapper: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  statusText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
    color: "#94A3B8",
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "rgba(31, 48, 94, 0.88)",
    marginTop: 16,
  },
  retryBtn: {
    marginTop: 24,
    backgroundColor: "rgba(31, 48, 94, 0.88)",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  emptyWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingBottom: 80,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "rgba(31, 48, 94, 0.88)",
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

export default CarCardsByBrand;
