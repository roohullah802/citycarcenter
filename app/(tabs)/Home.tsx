import BrandItems from "@/components/BrandItems";
import CarItems from "@/components/CarItems";
import { useFetchBrands } from "@/hooks/useFetchBrands";
import { useCars } from "@/hooks/useFetchCars";
import { Colors } from "@/utils/Colors";
import { GlobalStyles } from "@/utils/GlobalStyles";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Modalize } from "react-native-modalize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGetCurrentLocation } from "../../folder/getAddress";

// Skeleton Loader Component
const SkeletonLoader = ({ style }: { style?: any }) => (
  <View style={[styles.skeleton, style]} />
);

function HomeScreen() {
  const { isSignedIn, user } = useUser();
  const insets = useSafeAreaInsets();
  const modalRef = useRef<Modalize>(null);
  const location = useGetCurrentLocation();
  const [greeting, setGreeting] = useState("Good Morning");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

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
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={GlobalStyles.surface}
        contentContainerStyle={[
          GlobalStyles.scrollContainer,
          { paddingTop: insets.top + 10, paddingBottom: 40 },
        ]}
      >
        {/* HEADER SECTION */}
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Text style={styles.greetingText}>
              {greeting}, {isSignedIn ? user?.firstName || "Guest" : "Guest"}
            </Text>
            {isSignedIn && (
              <View style={styles.locationContainer}>
                <Ionicons name="location-sharp" size={14} color="rgba(31, 48, 94, 0.88)" />
                <Text style={styles.locationValue} numberOfLines={1}>
                  {location || "Detecting address..."}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.headerActions}>

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
                transition={300}
                cachePolicy={"memory-disk"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* HERO TITLE */}
        <View style={styles.heroSection}>
          <View style={styles.heroBgCircle} />
          <Text style={styles.title}>
            Find your ideal ride in{"\n"}
            <Text style={styles.highlightText}>just a few clicks.</Text>
          </Text>
        </View>

        {/* SEARCH BAR */}
        <TouchableOpacity
          onPress={() => router.push("/screens/Others/SearchCarCards")}
          activeOpacity={0.8}
          style={[GlobalStyles.inputBox, GlobalStyles.shadowLight, { marginHorizontal: 20, paddingLeft: 16, paddingRight: 8 }]}
        >
          <Ionicons name="search-outline" size={20} color={Colors.muted} />
          <Text style={styles.searchPlaceholder}>
            Search for your favorite car...
          </Text>
          <View style={styles.filterIcon}>
            <Ionicons name="options-outline" size={18} color={Colors.white} />
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

        {/* ERROR STATE */}
        {(brandsError || carsError) && (
          <View style={styles.errorContainer}>
            <View style={[GlobalStyles.center, { marginBottom: 12 }]}>
              <Ionicons name="cloud-offline-outline" size={44} color={Colors.danger} />
            </View>
            <Text style={styles.errorTitle}>Something went wrong</Text>
            <Text style={styles.errorSub}>
              We're having trouble connecting to our servers. Please check your internet and try again.
            </Text>
            <TouchableOpacity
              style={[styles.retryBtn, { backgroundColor: Colors.primary }]}
              onPress={onRetry}
            >
              <Text style={styles.retryBtnText}>Retry Connection</Text>
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
              <View style={{ flexDirection: "row", paddingLeft: 20 }}>
                {[1, 2, 3, 4].map((i) => (
                  <View key={i} style={{ marginRight: 14 }}>
                    <SkeletonLoader style={{ width: 68, height: 68, borderRadius: 18 }} />
                    <SkeletonLoader style={{ width: 50, height: 10, marginTop: 8, alignSelf: "center" }} />
                  </View>
                ))}
              </View>
            ) : (
              <FlatList
                data={brands?.brands}
                renderItem={({ item }) => <BrandItems item={item} />}
                keyExtractor={(item, index) => index.toString()}
                initialNumToRender={4}
                maxToRenderPerBatch={4}
                windowSize={5}
                removeClippedSubviews={true}
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
              <View style={{ flexDirection: "row", paddingLeft: 20 }}>
                {[1, 2].map((i) => (
                  <View key={i} style={{ marginRight: 16 }}>
                    <SkeletonLoader style={{ width: 260, height: 280, borderRadius: 20 }} />
                  </View>
                ))}
              </View>
            ) : (
              <FlatList
                data={cars?.data}
                renderItem={({ item }) => <CarItems item={item} />}
                keyExtractor={(item) => item._id}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                windowSize={6}
                removeClippedSubviews={true}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
              />
            )}
          </View>
        )}
      </ScrollView>

      {/* PROFILE MODAL */}
      <Modalize ref={modalRef} adjustToContentHeight handlePosition="inside" modalStyle={styles.modalStyle}>
        <View style={styles.modalInner}>
          <View style={styles.modalProfileWrapper}>
            <Image
              source={
                isSignedIn && user?.imageUrl
                  ? { uri: user.imageUrl }
                  : require("../../assests/guest3.png")
              }
              style={styles.modalProfileImage}
              transition={300}
              cachePolicy={"memory-disk"}
            />
            {isSignedIn && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              </View>
            )}
          </View>
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
  header: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerInfo: { flex: 1 },
  greetingText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "600",
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationValue: {
    fontSize: 15,
    fontWeight: "800",
    color: "rgba(31, 48, 94, 0.88)",
    marginLeft: 4,
    maxWidth: "90%",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  notificationBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  notificationDot: {
    position: "absolute",
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  profileImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: "rgba(31, 48, 94, 0.88)",
  },
  heroSection: { paddingHorizontal: 20, marginBottom: 24, position: "relative" },
  heroBgCircle: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#E0F2FE",
    opacity: 0.5,
    top: -40,
    right: -20,
    zIndex: -1,
  },
  title: { fontSize: 28, fontWeight: "300", color: "rgba(31, 48, 94, 0.88)", lineHeight: 36, letterSpacing: -0.5 },
  highlightText: { fontWeight: "800", color: "rgba(31, 48, 94, 0.88)" },
  searchPlaceholder: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: Colors.muted,
    fontWeight: "500",
  },
  filterIcon: { backgroundColor: Colors.primary, padding: 10, borderRadius: 12 },
  section: { marginTop: 32 },
  sectionHeader: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 20, fontWeight: "800", color: "rgba(31, 48, 94, 0.88)", letterSpacing: -0.5 },
  seeAll: { fontSize: 13, color: "rgba(31, 48, 94, 0.88)", fontWeight: "700", marginBottom: 2 },
  horizontalList: { paddingLeft: 20, paddingBottom: 10 },
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
    color: "rgba(31, 48, 94, 0.88)",
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
    backgroundColor: "rgba(31, 48, 94, 0.88)",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryBtnText: { color: "#FFF", fontWeight: "700", fontSize: 14 },
  modalStyle: { borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  modalInner: { alignItems: "center", padding: 32, paddingBottom: 40 },
  modalProfileWrapper: { position: "relative", marginBottom: 16 },
  modalProfileImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: "#EEF2F6",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: -4,
    backgroundColor: "#FFF",
    borderRadius: 12,
  },
  modalName: { fontSize: 22, fontWeight: "800", color: "rgba(31, 48, 94, 0.88)" },
  modalEmail: { fontSize: 15, color: "#64748B", marginTop: 4, fontWeight: "500" },
  modalDivider: {
    height: 1,
    width: "100%",
    backgroundColor: "#F1F5F9",
    marginVertical: 24,
  },
  modalButton: {
    width: "100%",
    height: 56,
    backgroundColor: "rgba(31, 48, 94, 0.88)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtonText: { fontSize: 16, fontWeight: "700", color: "#FFF" },
  skeleton: {
    backgroundColor: "#E2E8F0",
    opacity: 0.7,
  },
});

export default HomeScreen;
