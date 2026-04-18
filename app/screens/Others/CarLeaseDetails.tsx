import { ImageItem } from "@/components/ImageItems";
import { useFavorites } from "@/context/FavoutiteContext";
import { capitalText } from "@/folder/capitalText";
import { useCarById } from "@/hooks/useFetchCars";
import { useAuth } from "@clerk/expo";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";

const { width, height } = Dimensions.get("window");

const HEADER_HEIGHT_RATIO = 0.38;

const CarDetails = () => {
  const { id } = useLocalSearchParams();
  const { isSignedIn } = useAuth();
  const { isFavourite, handleFav } = useFavorites();
  const { data, isLoading, isError, refetch } = useCarById(id as string);
  const details = data?.data[0];

  const insets = useSafeAreaInsets();

  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const [isAct, setIsAct] = useState<boolean>(false);
  const [isShowMoreBtn, setIsShowMoreBtn] = useState<boolean>(false);

  const onViewRef = useRef(({ viewableItems }: any) => {
    if (viewableItems?.length > 0) setActiveIndex(viewableItems[0].index);
  });

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });
  const HEADER_HEIGHT = height * HEADER_HEIGHT_RATIO;

  const images = details?.images;
  const isFav = isFavourite(details?._id);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#73C2FB" />
        <Text style={styles.loadingText}>Fetching car details...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Icon name="cloud-offline-outline" size={50} color="#FF6B6B" />
        <Text style={styles.errorTitle}>Connection Error</Text>
        <Text style={styles.message}>
          Unable to load car details at this time.
        </Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!details) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Icon name="search-outline" size={50} color="#999" />
        <Text style={styles.loadingText}>Car not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
          <Text style={{ color: "#73C2FB", marginTop: 10, fontFamily: "bold" }}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Header with Image Slider */}
      <View style={[styles.header, { height: HEADER_HEIGHT }]}>
        {images?.length === 0 ? (
          <View style={[styles.carImageContainer, { height: HEADER_HEIGHT }]}>
            <Image source={"../../../assests/placeholder.png"} />
          </View>
        ) : (
          <>
            <FlatList
              data={images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => (
                <ImageItem
                  item={item}
                  index={index}
                  HEADER_HEIGHT={HEADER_HEIGHT}
                  id={details?._id}
                />
              )}
              onViewableItemsChanged={onViewRef.current}
              viewabilityConfig={viewConfigRef.current}
              ref={flatListRef}
              scrollEnabled={true}
            />

            {images?.length > 1 && (
              <View style={[styles.dotsContainer, { bottom: 40 }]}>
                {images.map((_: any, index: any) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      {
                        opacity: index === activeIndex ? 1 : 0.3,
                        transform: [{ scale: index === activeIndex ? 1.2 : 1 }],
                      },
                    ]}
                  />
                ))}
              </View>
            )}
          </>
        )}

        {/* Overlay Header Icons */}
        <SafeAreaView style={styles.overlayHeader}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.back()}
          >
            <Icon name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => handleFav(details?._id)}
          >
            <Icon
              name={isFav ? "heart" : "heart-outline"}
              size={22}
              color="#fff"
            />
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      {/* Scrollable Details Section */}
      <ScrollView
        style={styles.detailsSection}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 90 + insets.bottom },
        ]}
      >
        <View style={styles.titleRow}>
          <Text style={styles.carTitle} numberOfLines={1}>
            {details?.modelName ? capitalText(details?.modelName) : "N/A"}
          </Text>
          <View style={styles.ratingRow}>
            <Icon name="star" size={15} color="#f5a623" />
            <Text style={styles.rating}>({details?.totalReviews || 0})</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statsCol}>
            <Text style={styles.statsLabel}>Year</Text>
            <Text style={styles.statsValue}>{details?.year}</Text>
          </View>
          <View style={styles.statsCol}>
            <Text style={styles.statsLabel}>Mileage</Text>
            <Text style={styles.statsValue}>{details?.allowedMilleage}</Text>
          </View>
          <View style={styles.statsCol}>
            <Text style={styles.statsLabel}>Transmission</Text>
            <Text style={styles.statsValue}>{details?.transmission}</Text>
          </View>
          <View style={styles.statsCol}>
            <Text style={styles.statsLabel}>Fuel</Text>
            <Text style={styles.statsValue}>{details?.fuelType}</Text>
          </View>
        </View>

        {/* Details */}
        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.detailsBox}>
          <View style={styles.detailsLeft}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Brand</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Car</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Color</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Doors</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>PricePerDay</Text>
            </View>
            <View style={[styles.priceRow, styles.noBorder]}>
              <Text style={styles.priceLabel}>Weekly Rate</Text>
            </View>
          </View>

          <View style={styles.detailsRight}>
            <View style={styles.priceRow}>
              <Text style={styles.priceValue}>
                {details?.brand ? capitalText(details.brand) : "N/A"}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceValue}>
                {details?.modelName ? capitalText(details.modelName) : "N/A"}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceValue}>{details?.color}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceValue}>{details?.doors}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceValue}>{details?.pricePerDay}</Text>
            </View>
            <View style={[styles.priceRow, styles.noBorder]}>
              <Text style={styles.priceValue}>{details?.weeklyRate}</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View>
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text
            style={styles.descriptionText}
            numberOfLines={isAct ? undefined : 2}
            onTextLayout={(e) => {
              if (e.nativeEvent.lines.length > 2) {
                setIsShowMoreBtn(true);
              }
            }}
          >
            {details?.description}
          </Text>

          {isShowMoreBtn && (
            <TouchableOpacity onPress={() => setIsAct(!isAct)}>
              <Text style={styles.showMoreBtn}>
                {isAct ? "Less" : "show more"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Features */}
        <Text style={styles.featuresTitle}>Features</Text>
        <View style={styles.featuresRow}>
          <View style={styles.featureCard}>
            <View style={styles.featureIconWrapper}>
              <MaterialIcon name="chair-rolling" size={25} color="#1F305E" />
            </View>
            <Text style={styles.featureLabel}>Total Capacity</Text>
            <Text style={styles.featureValue}>{details?.passengers} seats</Text>
          </View>
          <View style={styles.featureCard}>
            <View style={styles.featureIconWrapper}>
              <MaterialIcon name="speedometer" size={25} color="#1F305E" />
            </View>
            <Text style={styles.featureLabel}>High Speed</Text>
            <Text style={styles.featureValue}>{details?.topSpeed} KM/H</Text>
          </View>
          <View style={styles.featureCard}>
            <View style={styles.featureIconWrapper}>
              <MaterialIcon
                name="car-shift-pattern"
                size={25}
                color="#1F305E"
              />
            </View>
            <Text style={styles.featureLabel}>Car Type</Text>
            <Text style={styles.featureValue}>{details?.transmission}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footerRow, { paddingBottom: insets.bottom + 2 }]}>
        <View>
          <Text style={styles.footerPriceLabel}>Price: </Text>
          <Text style={styles.price}>${details?.pricePerDay}/day</Text>
        </View>

        <TouchableOpacity
          style={styles.buyBtn}
          onPress={() => {
            if (!isSignedIn) {
              router.push("/screens/Auth/SocialAuth");
            } else {
              router.push({
                pathname: "/screens/Others/DateAndTime",
                params: { carId: details?._id },
              });
            }
          }}
        >
          <Text style={styles.buyText}>Rent Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CarDetails;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 16, color: "#666", fontFamily: "demiBold" },

  header: {
    width: "100%",
    backgroundColor: "#f0f0f0",
    overflow: "hidden",
    position: "relative",
  },

  carImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  fallbackImage: { zIndex: 1 },
  loadingImage: { opacity: 0 },

  overlayHeader: {
    position: "absolute",
    top: 15,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 20,
  },
  iconBtn: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 20,
    zIndex: 21,
  },
  carImageContainer: {
    width,
    position: "relative",
  },
  detailsSection: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    marginTop: -30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  scrollContent: { paddingBottom: 40 },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  carTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#3f3f3fff",
    fontFamily: "bold",
  },
  ratingRow: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
  rating: {
    marginLeft: 5,
    fontSize: 14,
    color: "#3f3f3fff",
    fontFamily: "demiBold",
  },

  statsRow: {
    width: "100%",
    height: 80,
    backgroundColor: "#e7e8ebff",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: 10,
  },
  statsCol: { alignItems: "center", gap: 8 },
  statsLabel: {
    color: "black",
    fontSize: 10,
    fontFamily: "demiBold",
  },
  statsValue: {
    color: "black",
    fontFamily: "demiBold",
    fontSize: 11,
  },

  sectionTitle: {
    fontFamily: "bold",
    fontSize: RFValue(12),
    marginTop: RFValue(10),
    marginBottom: RFValue(10),
    color: "#3f3f3fff",
  },
  detailsBox: {
    borderWidth: 0.5,
    borderColor: "gray",
    flexDirection: "row",
    overflow: "hidden",
    borderRadius: 10,
  },
  detailsLeft: { backgroundColor: "#e7e8ebff", width: "35%" },
  detailsRight: { width: "65%" },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: RFValue(10),
    borderBottomWidth: 0.5,
    borderColor: "black",
    paddingBottom: 5,
  },
  priceLabel: {
    width: "100%",
    fontSize: RFValue(10),
    fontFamily: "demiBold",
    color: "black",
    marginLeft: 10,
    marginRight: 10,
  },
  priceValue: {
    width: "55%",
    fontSize: RFValue(10),
    fontFamily: "demiBold",
    color: "black",
    marginLeft: 10,
  },
  noBorder: { borderBottomWidth: 0 },

  descriptionTitle: {
    color: "#3f3f3fff",
    marginTop: 20,
    fontFamily: "bold",
  },
  descriptionText: {
    color: "black",
    fontFamily: "medium",
    fontSize: 12,
    marginTop: 10,
  },
  showMoreBtn: {
    color: "#73C2FB",
    fontFamily: "demiBold",
    fontSize: 12,
    position: "absolute",
    right: 0,
  },

  featuresTitle: {
    fontFamily: "bold",
    color: "#3f3f3fff",
    marginTop: 20,
  },
  featuresRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  featureCard: {
    alignItems: "center",
    flex: 1,
    paddingVertical: 20,
    margin: 5,
    backgroundColor: "#eef5ff",
    gap: 5,
    borderRadius: 10,
  },
  featureIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: "#FEFEFA",
    alignItems: "center",
    justifyContent: "center",
  },
  featureValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3f3f3fff",
    fontFamily: "bold",
  },
  featureLabel: {
    fontSize: 10,
    color: "#666",
    marginTop: 3,
    fontFamily: "demiBold",
  },

  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    backgroundColor: "white",
    width: "100%",
    paddingTop: 5,
    paddingLeft: 20,
    paddingRight: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  footerPriceLabel: {
    color: "#3f3f3fff",
    marginTop: 15,
    fontSize: 10,
  },
  price: {
    fontSize: 13,
    fontWeight: "700",
    color: "#3f3f3fff",
    fontFamily: "bold",
  },
  buyBtn: {
    backgroundColor: "#73C2FB",
    paddingVertical: 12,
    paddingHorizontal: 80,
    borderRadius: 30,
  },
  buyText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "demiBold",
  },

  dotsContainer: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    flexDirection: "row",
    zIndex: 20,
  },
  dot: {
    width: 13,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#fff",
    margin: 2,
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorTitle: {
    fontSize: 18,
    fontFamily: "bold",
    color: "#333",
    marginTop: 15,
  },
  message: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    paddingHorizontal: 40,
    marginTop: 5,
  },
  retryBtn: {
    marginTop: 20,
    backgroundColor: "#73C2FB",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryText: {
    color: "#fff",
    fontFamily: "bold",
  },
  backLink: {
    marginTop: 15,
    padding: 10,
  },
});
