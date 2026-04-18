import BrandItems from "@/components/BrandItems";
import CarItems from "@/components/CarItems";
import { useAuth, useUser } from "@clerk/expo";
import { router } from "expo-router";
import React, { useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Modalize } from "react-native-modalize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
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
    error: brandsError,
  } = useFetchBrands();
  const { data: cars, isLoading: carsLoading, error: carsError } = useCars();

  const openProfileModal = () => {
    modalRef.current?.open();
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + 30 },
        ]}
      >
        {/* HEADER */}

        <View style={styles.header}>
          {isSignedIn ? (
            <View>
              <Text style={styles.locationLabel}>Location</Text>
              <Text style={styles.locationValue} numberOfLines={1}>
                {location || "Fetching location..."}
              </Text>
            </View>
          ) : (
            <Text style={styles.guest}>Welcome</Text>
          )}

          <TouchableOpacity onPress={openProfileModal}>
            <Image
              source={
                isSignedIn
                  ? { uri: user?.imageUrl }
                  : require("../../assests/guest3.png")
              }
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>

        {/* SEARCH */}

        <Text style={styles.title}>
          Find your ideal ride in just a few clicks{"\n"}
          <Text style={styles.boldText}>quick, easy, and reliable</Text>
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/screens/Others/SearchCarCards")}
          activeOpacity={0.5}
          style={styles.searchBarContainer}
        >
          <Text style={[styles.searchInput, { color: "#E5E4E2" }]}>Search</Text>

          <Icon
            name="search"
            size={18}
            color="#999"
            style={styles.searchIcon}
          />
        </TouchableOpacity>

        {/* BRANDS */}

        <View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Brands</Text>

            <TouchableOpacity
              onPress={() => router.push("/screens/Others/BrandCards")}
            >
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {brandsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#73C2FB" />
              <Text style={styles.loadingText}>Loading brands...</Text>
            </View>
          ) : brandsError ? (
            <Text style={styles.errorText}>Failed to load brands</Text>
          ) : (
            <FlatList
              data={brands?.brands}
              renderItem={({ item }) => <BrandItems item={item} />}
              keyExtractor={(item) => item.brand}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          )}
        </View>

        {/* CARS */}

        <View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Near You</Text>

            <TouchableOpacity
              onPress={() => router.push("/screens/Others/SearchCarCards")}
            >
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {carsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#73C2FB" />
              <Text style={styles.loadingText}>Loading cars...</Text>
            </View>
          ) : carsError ? (
            <Text style={styles.errorText}>Failed to load cars</Text>
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
      </ScrollView>

      {/* PROFILE MODAL */}

      <Modalize
        ref={modalRef}
        adjustToContentHeight
        handleStyle={{ backgroundColor: "#73C2FB" }}
        modalStyle={{ padding: 30 }}
      >
        <View style={styles.modalContent}>
          <Image
            source={
              isSignedIn
                ? { uri: user?.imageUrl }
                : require("../../assests/guest3.png")
            }
            style={styles.modalProfileImage}
          />

          <Text style={styles.modalName}>{user?.fullName}</Text>

          <Text style={styles.modalEmail}>
            {user?.primaryEmailAddress?.emailAddress}
          </Text>
        </View>
      </Modalize>
    </>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? 20 : 30,
  },

  loadingScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  header: {
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  locationLabel: {
    fontSize: 11,
    color: "#3f3f3fff",
    fontFamily: "bold",
  },

  locationValue: {
    fontSize: 10,
    fontWeight: "600",
    color: "gray",
    fontFamily: "demiBold",
    width: 230,
  },

  guest: {
    fontFamily: "bold",
    fontSize: 20,
    color: "#3f3f3fff",
  },

  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  title: {
    paddingHorizontal: 16,
    fontSize: 14,
    marginTop: 20,
    color: "#3f3f3fff",
    fontFamily: "bold",
  },

  boldText: {
    fontWeight: "bold",
  },

  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 20,
    paddingHorizontal: 10,
    borderWidth: 0.3,
    borderColor: "#C0C0C0",
    padding: 3,
  },

  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: "#333",
  },

  searchIcon: {
    marginLeft: 10,
    fontSize: 25,
    color: "#E5E4E2",
  },

  sectionHeader: {
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    alignItems: "center",
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: "bold",
    color: "#3f3f3fff",
  },

  seeAll: {
    fontSize: 12,
    color: "#73C2FB",
    fontFamily: "demiBold",
  },

  horizontalList: {
    paddingHorizontal: 16,
  },

  modalContent: {
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 100,
  },

  modalProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 15,
  },

  modalName: {
    fontSize: 16,
    fontFamily: "bold",
    color: "black",
    marginBottom: 5,
  },

  modalEmail: {
    fontSize: 14,
    color: "gray",
    fontFamily: "demiBold",
  },
  errorText: {
    textAlign: "center",
    color: "red",
    fontSize: 12,
    marginVertical: 10,
  },

  loadingContainer: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 12,
    color: "#73C2FB",
    fontFamily: "demiBold",
  },
});
