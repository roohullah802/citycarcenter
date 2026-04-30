import { useFetchBrands } from "@/hooks/useFetchBrands";
import { Colors } from "@/utils/Colors";
import { GlobalStyles } from "@/utils/GlobalStyles";
import { Ionicons } from "@expo/vector-icons";
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
import BrandCard from "../../../components/BrandCard";

const TopBrandsScreen = () => {
  const [search, setSearch] = useState<string>("");
  const { data, isError, isLoading, refetch } = useFetchBrands();

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

  if (isLoading) {
    return (
      <View style={[GlobalStyles.surface, GlobalStyles.center]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.statusText}>Discovering Brands...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[GlobalStyles.surface, GlobalStyles.center, { paddingHorizontal: 40 }]}>
        <Ionicons name="cloud-offline-outline" size={50} color={Colors.danger} />
        <Text style={styles.errorTitle}>Network Error</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <StatusBar barStyle="dark-content" />

      {/* REFINED HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.navButton}
        >
          <Ionicons name="chevron-back" size={28} color={Colors.primary} />
        </TouchableOpacity>

        <Text style={GlobalStyles.headerTitle}>Browse Brands</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* PROFESSIONAL SEARCH BOX */}
      <View style={styles.searchSection}>
        <View style={[GlobalStyles.inputBox, { backgroundColor: Colors.surface, height: 52, borderRadius: 14 }]}>
          <Ionicons name="search-outline" size={20} color={Colors.muted} />
          <TextInput
            placeholder="Find your favorite brand..."
            value={search}
            onChangeText={setSearch}
            style={styles.input}
            placeholderTextColor={Colors.muted}
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      {/* BRAND GRID */}
      {filteredBrands.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="briefcase-outline" size={48} color="#CBD5E1" />
          <Text style={styles.emptyText}>No matches found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredBrands}
          numColumns={4}
          keyExtractor={(item, index) => item._id || index.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={renderBrand}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={10}
          removeClippedSubviews={true}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.columnGap}
        />
      )}
    </SafeAreaView>
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
  navButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "rgba(31, 48, 94, 0.88)",
    letterSpacing: -0.5,
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
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "600",
    color: "rgba(31, 48, 94, 0.88)",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  columnGap: {
    justifyContent: "flex-start",
    gap: 8,
  },
  centeredWrapper: {
    flex: 1,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
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
  retryButton: {
    marginTop: 24,
    backgroundColor: "rgba(31, 48, 94, 0.88)",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  retryText: {
    color: "#FFF",
    fontWeight: "700",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#94A3B8",
  },
});

export default TopBrandsScreen;
