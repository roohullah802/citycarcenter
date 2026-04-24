import { ImageItem } from "@/components/ImageItems";
import { useFavorites } from "@/context/FavoutiteContext";
import { capitalText } from "@/folder/capitalText";
import { useCarById } from "@/hooks/useFetchCars";
import { useAuth } from "@clerk/expo";
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
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const { height } = Dimensions.get("window");
const HEADER_HEIGHT = height * 0.42;

const CarDetails = () => {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { isSignedIn } = useAuth();
  const { isFavourite, handleFav } = useFavorites();

  const { data, isLoading, isError, refetch } = useCarById(id as string);
  const details = data?.data?.[0];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMoreBtn, setShowMoreBtn] = useState(false);

  const onViewRef = useRef(({ viewableItems }: any) => {
    if (viewableItems?.length > 0) setActiveIndex(viewableItems[0].index);
  });

  // --- 1. LOADING STATE ---
  if (isLoading) {
    return (
      <View style={styles.centerWrapper}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color="rgba(31, 48, 94, 0.88)" />
        <Text style={styles.loadingText}>Loading Vehicle Details...</Text>
      </View>
    );
  }

  // --- 2. ERROR STATE ---
  if (isError || !details) {
    return (
      <View style={styles.centerWrapper}>
        <StatusBar barStyle="dark-content" />
        <Ionicons name="cloud-offline-outline" size={60} color="#EF4444" />
        <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
        <Text style={styles.errorSubtitle}>
          We couldn&apos;t retrieve the car information. Please check your
          connection.
        </Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 20 }}
        >
          <Text style={{ color: "#94A3B8", fontWeight: "600" }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isFav = isFavourite(details?._id);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* IMAGE HEADER */}
      <View style={{ height: HEADER_HEIGHT }}>
        <FlatList
          data={details?.images || []}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
          renderItem={({ item, index }) => (
            <ImageItem
              item={item}
              index={index}
              HEADER_HEIGHT={HEADER_HEIGHT}
              id={details?._id}
            />
          )}
        />

        <View style={styles.paginationWrapper}>
          {details?.images?.map((_: any, index: number) => (
            <View
              key={index}
              style={[
                styles.pill,
                {
                  width: index === activeIndex ? 20 : 8,
                  backgroundColor: index === activeIndex ? "rgba(31, 48, 94, 0.88)" : "#FFF",
                },
              ]}
            />
          ))}
        </View>

        <View style={[styles.headerOverlay, { top: insets.top + 10 }]}>
          <TouchableOpacity
            style={styles.roundBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="rgba(31, 48, 94, 0.88)" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.roundBtn}
            onPress={() => handleFav(details?._id)}
          >
            <Ionicons
              name={isFav ? "heart" : "heart-outline"}
              size={24}
              color={isFav ? "#EF4444" : "rgba(31, 48, 94, 0.88)"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* DETAILS CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.detailsPanel}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <View style={styles.titleSection}>
          <View style={styles.titleInfo}>
            <Text style={styles.brandName}>{capitalText(details?.brand)}</Text>
            <Text style={styles.modelName}>
              {capitalText(details?.modelName)}
            </Text>
          </View>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={14} color="#F5A623" />
            <Text style={styles.ratingText}>{details?.totalReviews || 0}</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsBar}>
          <StatBox icon="calendar-outline" label="Year" value={details?.year} />
          <StatBox
            icon="speedometer-outline"
            label="KM Limit"
            value={details?.allowedMilleage}
          />
          <StatBox
            icon="cog-outline"
            label="Auto"
            value={details?.transmission}
          />
          <StatBox
            icon="color-palette-outline"
            label="Color"
            value={details?.color}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text
            style={styles.description}
            numberOfLines={isExpanded ? undefined : 3}
            onTextLayout={(e) => setShowMoreBtn(e.nativeEvent.lines.length > 3)}
          >
            {details?.description}
          </Text>
          {showMoreBtn && (
            <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
              <Text style={styles.readMore}>
                {isExpanded ? "Show Less" : "Read More"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          <View style={styles.featureGrid}>
            <FeatureItem
              icon="account-group-outline"
              label="Capacity"
              value={`${details?.passengers} Seats`}
            />
            <FeatureItem
              icon="lightning-bolt-outline"
              label="Top Speed"
              value={`${details?.topSpeed} km/h`}
            />
            <FeatureItem
              icon="gas-station-outline"
              label="Fuel Type"
              value={details?.fuelType}
            />
          </View>
        </View>
      </ScrollView>

      {/* FIXED RENT FOOTER */}
      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom > 0 ? insets.bottom : 20 },
        ]}
      >
        <View>
          <Text style={styles.footerLabel}>Daily Rate</Text>
          <Text style={styles.footerPrice}>
            ${details?.pricePerDay}
            <Text style={styles.perDay}> / day</Text>
          </Text>
        </View>
        <TouchableOpacity
          style={styles.bookBtn}
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
          <Text style={styles.bookBtnText}>Rent Now</Text>
          <Ionicons
            name="arrow-forward"
            size={18}
            color="#FFF"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const StatBox = ({ icon, label, value }: any) => (
  <View style={styles.statBox}>
    <Ionicons name={icon} size={18} color="rgba(31, 48, 94, 0.88)" />
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const FeatureItem = ({ icon, label, value }: any) => (
  <View style={styles.featureCard}>
    <MaterialCommunityIcons name={icon} size={24} color="rgba(31, 48, 94, 0.88)" />
    <View style={{ marginLeft: 12 }}>
      <Text style={styles.featLabel}>{label}</Text>
      <Text style={styles.featValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  centerWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingHorizontal: 40,
  },
  loadingText: {
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
  errorSubtitle: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  retryBtn: {
    marginTop: 24,
    backgroundColor: "rgba(31, 48, 94, 0.88)",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 14,
  },
  retryText: { color: "#FFF", fontWeight: "700" },

  headerOverlay: {
    position: "absolute",
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  roundBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationWrapper: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  pill: { height: 8, borderRadius: 4 },

  detailsPanel: {
    flex: 1,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: "rgba(31, 48, 94, 0.88)",
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
      android: { elevation: 8 },
    }),
  },
  titleSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  titleInfo: { flex: 1, paddingRight: 10 },
  brandName: {
    fontSize: 13,
    fontWeight: "800",
    color: "rgba(31, 48, 94, 0.88)",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  modelName: {
    fontSize: 26,
    fontWeight: "800",
    color: "rgba(31, 48, 94, 0.88)",
    marginTop: 4,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  ratingText: { marginLeft: 4, fontWeight: "700", color: "rgba(31, 48, 94, 0.88)" },

  statsBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...Platform.select({
      ios: {
        shadowColor: "rgba(31, 48, 94, 0.88)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
      },
      android: { elevation: 2 },
    }),
  },
  statBox: { alignItems: "center" },
  statLabel: {
    fontSize: 10,
    color: "#94A3B8",
    fontWeight: "700",
    marginTop: 6,
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "rgba(31, 48, 94, 0.88)",
    marginTop: 2,
  },

  section: { marginBottom: 32 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "rgba(31, 48, 94, 0.88)",
    marginBottom: 12,
  },
  description: { fontSize: 15, color: "#64748B", lineHeight: 24 },
  readMore: { color: "rgba(31, 48, 94, 0.88)", fontWeight: "700", marginTop: 8 },

  featureGrid: { gap: 12 },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...Platform.select({
      ios: {
        shadowColor: "rgba(31, 48, 94, 0.88)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  featLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
  },
  featValue: { fontSize: 15, fontWeight: "700", color: "rgba(31, 48, 94, 0.88)" },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    zIndex: 50,
    ...Platform.select({
      ios: {
        shadowColor: "rgba(31, 48, 94, 0.88)",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: { elevation: 10 },
    }),
  },
  footerLabel: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  footerPrice: { fontSize: 22, fontWeight: "800", color: "rgba(31, 48, 94, 0.88)" },
  perDay: { fontSize: 14, color: "#94A3B8", fontWeight: "400" },
  bookBtn: {
    backgroundColor: "rgba(31, 48, 94, 0.88)",
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "rgba(31, 48, 94, 0.88)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },
  bookBtnText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
});

export default CarDetails;
