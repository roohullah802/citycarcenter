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
  // Main Container
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  // Loading & State Containers
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    fontSize: RFValue(13),
    color: "#64748B",
    fontFamily: "demiBold",
    marginTop: 10,
  },

  // Header & Carousel
  header: {
    width: "100%",
    backgroundColor: "#F1F5F9",
    overflow: "hidden",
    position: "relative",
  },
  carImageContainer: {
    width: width,
    position: "relative",
  },
  carImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  fallbackImage: {
    zIndex: 1,
    resizeMode: "contain",
  },
  loadingImage: {
    opacity: 0,
  },

  // Overlay Header Icons
  overlayHeader: {
    position: "absolute",
    top: 15,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 25,
  },
  iconBtn: {
    backgroundColor: "rgba(15, 23, 42, 0.4)", // Dark slate overlay
    padding: 10,
    borderRadius: 25,
    zIndex: 26,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },

  // Carousel Pagination Dots
  dotsContainer: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    flexDirection: "row",
    zIndex: 20,
    backgroundColor: "rgba(0,0,0,0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 3,
  },

  // Content Panel (Sheet style)
  detailsSection: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 24,
    paddingTop: 30,
    marginTop: -35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 15,
  },
  scrollContent: {
    paddingBottom: 120,
  },

  // Heading & Info
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  carTitle: {
    fontSize: RFValue(19),
    color: "#0F172A",
    fontFamily: "bold",
    flex: 1,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBEB",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rating: {
    marginLeft: 4,
    fontSize: RFValue(12),
    color: "#B45309",
    fontFamily: "demiBold",
  },

  // Quick Stats Row
  statsRow: {
    width: "100%",
    height: 85,
    backgroundColor: "#F8FAFC",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    marginBottom: 25,
  },
  statsCol: {
    alignItems: "center",
    justifyContent: "center",
  },
  statsLabel: {
    color: "#94A3B8",
    fontSize: RFValue(9),
    fontFamily: "demiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statsValue: {
    color: "#1E293B",
    fontFamily: "bold",
    fontSize: RFValue(12),
  },

  // Specification Table
  sectionTitle: {
    fontFamily: "bold",
    fontSize: RFValue(13.5),
    marginTop: 15,
    marginBottom: 12,
    color: "#0F172A",
  },
  detailsBox: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    overflow: "hidden",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  detailsLeft: {
    backgroundColor: "#F8FAFC",
    width: "40%",
    borderRightWidth: 1,
    borderRightColor: "#E2E8F0",
  },
  detailsRight: {
    width: "60%",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  priceLabel: {
    fontSize: RFValue(11),
    fontFamily: "demiBold",
    color: "#475569",
    paddingLeft: 18,
  },
  priceValue: {
    fontSize: RFValue(11),
    fontFamily: "bold",
    color: "#0F172A",
    paddingLeft: 18,
  },
  noBorder: {
    borderBottomWidth: 0,
  },

  // Description
  descriptionTitle: {
    color: "#0F172A",
    marginTop: 25,
    fontFamily: "bold",
    fontSize: RFValue(13.5),
  },
  descriptionText: {
    color: "#475569",
    fontFamily: "medium",
    fontSize: RFValue(11.5),
    marginTop: 10,
    lineHeight: 20,
  },
  showMoreBtn: {
    color: "#3B82F6",
    fontFamily: "bold",
    fontSize: RFValue(11.5),
    marginTop: 8,
    alignSelf: "flex-end",
  },

  // Feature Cards Grid
  featuresTitle: {
    fontFamily: "bold",
    color: "#0F172A",
    marginTop: 25,
    fontSize: RFValue(13.5),
  },
  featuresRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  featureCard: {
    alignItems: "center",
    flex: 1,
    paddingVertical: 18,
    marginHorizontal: 6,
    backgroundColor: "#F0F9FF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0F2FE",
  },
  featureIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  featureValue: {
    fontSize: RFValue(11.5),
    color: "#0369A1",
    fontFamily: "bold",
    marginTop: 8,
  },
  featureLabel: {
    fontSize: RFValue(9),
    color: "#64748B",
    marginTop: 2,
    fontFamily: "demiBold",
  },

  // Sticky Bottom Footer
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#FFFFFF",
    width: "100%",
    paddingTop: 15,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 25,
  },
  footerPriceLabel: {
    color: "#94A3B8",
    fontSize: RFValue(10),
    fontFamily: "medium",
  },
  price: {
    fontSize: RFValue(18),
    color: "#0F172A",
    fontFamily: "bold",
  },
  buyBtn: {
    backgroundColor: "#73C2FB",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 14,
    shadowColor: "#1F305E",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  buyText: {
    color: "#FFFFFF",
    fontSize: RFValue(14),
    fontFamily: "bold",
  },

  // Error & Retry Logic UI
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 24,
  },
  errorTitle: {
    fontSize: RFValue(17),
    fontFamily: "bold",
    color: "#0F172A",
    marginTop: 20,
  },
  message: {
    fontSize: RFValue(12),
    color: "#64748B",
    textAlign: "center",
    paddingHorizontal: 25,
    marginTop: 8,
    lineHeight: 20,
    fontFamily: "medium",
  },
  retryBtn: {
    marginTop: 25,
    backgroundColor: "#1F305E",
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: "#FFFFFF",
    fontFamily: "bold",
    fontSize: RFValue(13),
  },
  backLink: {
    marginTop: 20,
    padding: 10,
  },
});
