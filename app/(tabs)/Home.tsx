import BrandItems from "@/components/BrandItems";
import CarItems from "@/components/CarItems";
import { useAuth, useUser } from "@clerk/expo";
import { Redirect, router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import { Modalize } from "react-native-modalize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useGetCurrentLocation } from "../../folder/getAddress";
import { useFetchBrands } from "@/hooks/useFetchBrands";
import { useCars } from "@/hooks/useFetchCars";

function HomeScreen() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  const modalRef = useRef<Modalize>(null);
  const location = useGetCurrentLocation();

  const {
    data: brands,
    isLoading: brandsLoading,
    isError: brandsError,
    refetch: refetchBrands,
  } = useFetchBrands();

  const {
    data: cars,
    isLoading: carsLoading,
    isError: carsError,
    refetch: refetchCars,
  } = useCars();

  const onRetry = () => {
    refetchBrands();
    refetchCars();
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + 10, paddingBottom: 40 },
        ]}
      >
        {/* HEADER SECTION */}
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            {isSignedIn ? (
              <>
                <View style={styles.locationContainer}>
                  <Ionicons name="location-sharp" size={14} color="#73C2FB" />
                  <Text style={styles.locationLabel}>CURRENT LOCATION</Text>
                </View>
                <Text style={styles.locationValue} numberOfLines={1}>
                  {location || "Detecting address..."}
                </Text>
              </>
            ) : (
              <Text style={styles.welcomeGuest}>Welcome to City Car</Text>
            )}
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => modalRef.current?.open()}
          >
            <Image
              source={
                isSignedIn && user?.imageUrl
                  ? { uri: user.imageUrl }
                  : require("../../assests/guest3.png")
              }
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>

        {/* HERO TITLE */}
        <View style={styles.heroSection}>
          <Text style={styles.title}>
            Find your ideal ride in{"\n"}
            <Text style={styles.highlightText}>just a few clicks.</Text>
          </Text>
        </View>

        {/* SEARCH BAR */}
        <TouchableOpacity
          onPress={() => router.push("/screens/Others/SearchCarCards")}
          activeOpacity={0.8}
          style={styles.searchBar}
        >
          <Ionicons name="search-outline" size={20} color="#94A3B8" />
          <Text style={styles.searchPlaceholder}>
            Search for your favorite car...
          </Text>
          <View style={styles.filterIcon}>
            <Ionicons name="options-outline" size={18} color="#FFF" />
          </View>
        </TouchableOpacity>

        {/* ERROR STATE VIEW */}
        {(brandsError || carsError) && (
          <View style={styles.errorContainer}>
            <Ionicons name="cloud-offline-outline" size={40} color="#EF4444" />
            <Text style={styles.errorTitle}>Something went wrong</Text>
            <Text style={styles.errorSub}>
              We couldn&apos;t load the latest fleet. Check your connection.
            </Text>
            <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
              <Text style={styles.retryBtnText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* BRANDS SECTION */}
        {!brandsError && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Top Brands</Text>
              <TouchableOpacity
                onPress={() => router.push("/screens/Others/BrandCards")}
              >
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>

            {brandsLoading ? (
              <ActivityIndicator style={styles.loader} color="#73C2FB" />
            ) : (
              <FlatList
                data={brands?.brands}
                renderItem={({ item }) => <BrandItems item={item} />}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
              />
            )}
          </View>
        )}

        {/* CARS SECTION */}
        {!carsError && (
          <View style={[styles.section, { marginTop: 10 }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Available Near You</Text>
              <TouchableOpacity
                onPress={() => router.push("/screens/Others/SearchCarCards")}
              >
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>

            {carsLoading ? (
              <ActivityIndicator style={styles.loader} color="#73C2FB" />
            ) : (
              <FlatList
                data={cars?.data}
                renderItem={({ item }) => <CarItems item={item} />}
                keyExtractor={(item) => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
              />
            )}
          </View>
        )}
      </ScrollView>

      {/* PROFILE MODAL */}
      <Modalize ref={modalRef} adjustToContentHeight handlePosition="inside">
        <View style={styles.modalInner}>
          <Image
            source={
              isSignedIn && user?.imageUrl
                ? { uri: user.imageUrl }
                : require("../../assests/guest3.png")
            }
            style={styles.modalProfileImage}
          />
          <Text style={styles.modalName}>
            {isSignedIn ? user?.fullName : "Guest User"}
          </Text>
          <Text style={styles.modalEmail}>
            {isSignedIn
              ? user?.primaryEmailAddress?.emailAddress
              : "Login to sync your data"}
          </Text>
          <View style={styles.modalDivider} />
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => modalRef.current?.close()}
          >
            <Text style={styles.modalButtonText}>Close Profile</Text>
          </TouchableOpacity>
        </View>
      </Modalize>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#FFFFFF" },
  header: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerInfo: { flex: 1 },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  locationLabel: {
    fontSize: 10,
    color: "#94A3B8",
    fontWeight: "800",
    letterSpacing: 1,
    marginLeft: 4,
  },
  locationValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F305E",
    maxWidth: "90%",
  },
  welcomeGuest: { fontSize: 22, fontWeight: "800", color: "#1F305E" },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  heroSection: { paddingHorizontal: 20, marginBottom: 20 },
  title: { fontSize: 22, fontWeight: "400", color: "#1F305E", lineHeight: 28 },
  highlightText: { fontWeight: "800", color: "#73C2FB" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    marginHorizontal: 20,
    paddingLeft: 16,
    paddingRight: 8,
    height: 54,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#F1F5F9",
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "500",
  },
  filterIcon: { backgroundColor: "#1F305E", padding: 8, borderRadius: 8 },
  section: { marginTop: 24 },
  sectionHeader: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#1F305E" },
  seeAll: { fontSize: 13, color: "#73C2FB", fontWeight: "700" },
  horizontalList: { paddingLeft: 20, paddingBottom: 10 },
  loader: { marginVertical: 20 },
  errorContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: "#FEF2F2",
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1F305E",
    marginTop: 10,
  },
  errorSub: {
    fontSize: 13,
    color: "#991B1B",
    textAlign: "center",
    marginTop: 4,
    lineHeight: 18,
  },
  retryBtn: {
    marginTop: 16,
    backgroundColor: "#1F305E",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryBtnText: { color: "#FFF", fontWeight: "700", fontSize: 14 },
  modalInner: { alignItems: "center", padding: 24, paddingBottom: 40 },
  modalProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  modalName: { fontSize: 20, fontWeight: "800", color: "#1F305E" },
  modalEmail: { fontSize: 14, color: "#64748B", marginTop: 4 },
  modalDivider: {
    height: 1,
    width: "100%",
    backgroundColor: "#F1F5F9",
    marginVertical: 24,
  },
  modalButton: {
    width: "100%",
    height: 54,
    backgroundColor: "#1F305E",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtonText: { fontSize: 16, fontWeight: "700", color: "#FFF" },
});

export default HomeScreen;
