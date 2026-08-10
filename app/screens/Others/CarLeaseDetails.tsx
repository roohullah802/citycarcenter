import { ImageItem } from "@/components/ImageItems";
import { capitalText } from "@/folder/capitalText";
import { useFetchFavourites, useToggleFavourite } from "@/hooks/useFavourites";
import { useCarById } from "@/hooks/useFetchCars";
import { Colors } from "@/utils/Colors";
import { GlobalStyles } from "@/utils/GlobalStyles";
import { useAuth } from "@clerk/expo";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import { useDocumentStatus } from "@/hooks/useDocuments";
import { showToast } from "@/folder/toastService";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height } = Dimensions.get("window");
const HEADER_HEIGHT = height * 0.42;

const CarDetails = () => {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { isSignedIn } = useAuth();
  const { data: favouritesData } = useFetchFavourites();
  const toggleFavourite = useToggleFavourite();

  const { data, isLoading, isError, refetch } = useCarById(id as string);
  const details = data?.data?.[0] || data?.car || data?.data;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMoreBtn, setShowMoreBtn] = useState(false);
  const { data: docData } = useDocumentStatus();
  const currentStatus = docData?.docStatus || "unverified";

  const onViewRef = useRef(({ viewableItems }: any) => {
    if (viewableItems?.length > 0) setActiveIndex(viewableItems[0].index);
  });

  // --- 1. LOADING STATE ---
  if (isLoading) {
    return (
      <View style={styles.centerWrapper}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading Vehicle Details...</Text>
      </View>
    );
  }

  // --- 2. ERROR STATE ---
  if (isError || !details) {
    return (
      <View style={styles.centerWrapper}>
        <StatusBar barStyle="dark-content" />
        <Ionicons name="cloud-offline-outline" size={60} color={Colors.danger} />
        <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
        <Text style={styles.errorSubtitle}>
          We couldn&apos;t retrieve the car information. Please check your connection.
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

  const isFav = favouritesData?.carIds?.includes(details?._id);
  const hasDiscount = details?.discountEnabled && details?.discountPercentage > 0;

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
          initialNumToRender={1}
          maxToRenderPerBatch={1}
          windowSize={2}
          removeClippedSubviews={true}
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
                  backgroundColor: index === activeIndex ? Colors.primary : "#FFF",
                },
              ]}
            />
          ))}
        </View>

        <View style={[styles.headerOverlay, { top: insets.top + 10 }]}>
          <TouchableOpacity
            style={styles.roundBtn}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.roundBtn}
            onPress={() => toggleFavourite.mutate(details?._id)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isFav ? "heart" : "heart-outline"}
              size={24}
              color={isFav ? Colors.primary : Colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Leased Badge */}
        {details?.available === false && (
          <View style={styles.leasedBadgeOverlay}>
            <View style={styles.leasedBadge}>
              <Ionicons name="lock-closed" size={16} color={Colors.white} />
              <Text style={styles.leasedBadgeText}>CURRENTLY LEASED</Text>
            </View>
          </View>
        )}
      </View>

      {/* DETAILS CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.detailsPanel}
        contentContainerStyle={{ paddingBottom: (insets.bottom || 0) + 140 }}
      >
        <View style={styles.titleSection}>
          <View style={styles.titleInfo}>
            {details?.brand ? (
              <Text style={styles.brandName}>{capitalText(details.brand)}</Text>
            ) : null}
            <Text style={styles.modelName}>
              {capitalText(details?.modelName)}
            </Text>
          </View>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={14} color="#F59E0B" />
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

        {/* Overview */}
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

        {/* Key Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          <View style={styles.featureGrid}>
            <FeatureItem
              icon="account-group-outline"
              label="Capacity"
              value={`${details?.passengers || 5} Seats`}
            />
            <FeatureItem
              icon="lightning-bolt-outline"
              label="Top Speed"
              value={`${details?.topSpeed || 200} km/h`}
            />
            <FeatureItem
              icon="gas-station-outline"
              label="Fuel Type"
              value={details?.fuelType || "Petrol"}
            />
          </View>
        </View>
      </ScrollView>

      {/* FIXED RENT FOOTER WITH PROPER SAFE AREA INSETS */}
      <View
        style={[
          styles.footer,
          {
            paddingBottom: (insets.bottom || 0) + 16,
            paddingTop: 16,
          },
        ]}
      >
        <View style={styles.priceContainer}>
          <View style={styles.rateLabelRow}>
            <Text style={styles.footerLabel}>Daily Rate</Text>
            {hasDiscount && (
              <View style={styles.discountTag}>
                <Text style={styles.discountTagText}>{details.discountPercentage}% OFF</Text>
              </View>
            )}
          </View>
          <Text style={styles.footerPrice}>
            ${details?.pricePerDay}
            <Text style={styles.perDay}> / day</Text>
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.bookBtn, details?.available === false && styles.disabledBookBtn]}
          disabled={details?.available === false}
          activeOpacity={0.8}
          onPress={() => {
            if (!isSignedIn) {
              router.push("/screens/Auth/SocialAuth");
            } else if (currentStatus === "pending") {
              showToast("Your documents are under review. Please wait for approval.");
            } else if (currentStatus !== "approved") {
              showToast("Please upload your documents to rent a car.");
              router.push("/screens/Setting/DocumentUploadScreen");
            } else {
              router.push({
                pathname: "/screens/Others/DateAndTime",
                params: { carId: details?._id },
              });
            }
          }}
        >
          <Text style={styles.bookBtnText}>
            {details?.available === false ? "Vehicle Rented" : "Rent Now"}
          </Text>
          {details?.available !== false && (
            <Ionicons
              name="arrow-forward"
              size={18}
              color="#FFF"
              style={{ marginLeft: 6 }}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const StatBox = ({ icon, label, value }: any) => (
  <View style={styles.statBox}>
    <Ionicons name={icon} size={18} color={Colors.primary} />
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const FeatureItem = ({ icon, label, value }: any) => (
  <View style={styles.featureCard}>
    <MaterialCommunityIcons name={icon} size={24} color={Colors.primary} />
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
    color: Colors.primary,
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
    backgroundColor: Colors.primary,
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
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0,0,0,0.15)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
    }),
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
        shadowColor: Colors.shadow,
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
    fontSize: 12,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  modelName: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.primary,
    marginTop: 2,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  ratingText: { marginLeft: 4, fontWeight: "700", color: Colors.primary },

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
        shadowColor: Colors.shadow,
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
    color: Colors.primary,
    marginTop: 2,
    textTransform: "capitalize",
  },

  section: { marginBottom: 32 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.primary,
    marginBottom: 12,
  },
  description: { fontSize: 15, color: "#64748B", lineHeight: 24 },
  readMore: { color: Colors.primary, fontWeight: "700", marginTop: 8 },

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
        shadowColor: Colors.shadow,
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
  featValue: { fontSize: 15, fontWeight: "700", color: Colors.primary, textTransform: "capitalize" },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    zIndex: 50,
    ...Platform.select({
      ios: {
        shadowColor: "rgba(31, 48, 94, 0.15)",
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: { elevation: 12 },
    }),
  },
  priceContainer: {
    justifyContent: "center",
  },
  rateLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerLabel: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  discountTag: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  discountTagText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#D97706",
  },
  footerPrice: { fontSize: 24, fontWeight: "800", color: Colors.primary, marginTop: 2 },
  perDay: { fontSize: 13, color: "#94A3B8", fontWeight: "500" },
  bookBtn: {
    backgroundColor: Colors.primary,
    height: 54,
    paddingHorizontal: 28,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },
  bookBtnText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  leasedBadgeOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  leasedBadge: {
    backgroundColor: Colors.danger,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
    ...GlobalStyles.shadowMedium,
  },
  leasedBadgeText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1,
  },
  disabledBookBtn: {
    backgroundColor: Colors.muted,
    opacity: 0.8,
  },
});

export default CarDetails;
