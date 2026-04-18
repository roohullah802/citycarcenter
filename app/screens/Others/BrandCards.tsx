import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import BrandCard from "../../../components/BrandCard";
import { useFetchBrands } from "@/hooks/useFetchBrands";

const TopBrandsScreen = () => {
  const [search, setSearch] = useState<string>("");
  const { data, isError, isLoading, refetch } = useFetchBrands();

  // 1. Correctly filter the LIVE data from the hook
  const filteredBrands = useMemo(() => {
    const brandsArray = data?.brands || [];
    if (!search) return brandsArray;

    return brandsArray.filter((brand: any) =>
      brand.brand.toLowerCase().includes(search.toLowerCase()),
    );
  }, [data?.brands, search]);

  const renderBrand = useCallback(({ item }: any) => {
    return <BrandCard item={item} />;
  }, []);

  // 2. Handle Loading State
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#73C2FB" />
        <Text style={styles.loadingText}>Loading Brands...</Text>
      </SafeAreaView>
    );
  }

  // 3. Handle Error State
  if (isError) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Icon name="cloud-offline-outline" size={50} color="red" />
        <Text style={styles.errorTitle}>Connection Error</Text>
        <Text style={styles.message}>
          Unable to fetch brands at the moment.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />

      {/* 4. Perfect Centered Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#1F305E" />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Top Brands</Text>
        </View>

        {/* Placeholder to keep title centered */}
        <View style={styles.backButton} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchBox}>
        <Icon name="search" size={18} color="#999" style={styles.searchIcon} />
        <TextInput
          placeholder="Search brands..."
          value={search}
          onChangeText={setSearch}
          style={styles.input}
          placeholderTextColor="#999"
          clearButtonMode="while-editing"
        />
      </View>

      {/* Grid */}
      {filteredBrands.length === 0 ? (
        <View style={styles.centered}>
          <Icon name="search-outline" size={40} color="#ccc" />
          <Text style={styles.noDataText}>No brands found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredBrands}
          numColumns={4}
          keyExtractor={(item, index) => item._id || index.toString()}
          contentContainerStyle={styles.grid}
          renderItem={renderBrand}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
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
    justifyContent: "space-between", // Essential for centering
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    color: "#3f3f3fff",
    fontFamily: "bold",
    textAlign: "center",
  },
  searchBox: {
    flexDirection: "row",
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    paddingHorizontal: 12,
    alignItems: "center",
    marginBottom: 16,
    height: 48,
  },
  searchIcon: { marginRight: 8 },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    fontFamily: "demiBold",
  },
  grid: {
    paddingBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#73C2FB",
    fontFamily: "medium",
  },
  errorTitle: {
    fontSize: 18,
    color: "red",
    fontFamily: "bold",
    marginTop: 10,
  },
  message: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
    fontFamily: "medium",
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: "#73C2FB",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontFamily: "bold",
  },
  noDataText: {
    marginTop: 10,
    color: "#999",
    fontFamily: "medium",
  },
});

export default TopBrandsScreen;
