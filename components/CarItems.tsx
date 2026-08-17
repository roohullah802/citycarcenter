import { capitalText } from "@/folder/capitalText";
import { useFetchFavourites, useToggleFavourite } from "@/hooks/useFavourites";
import { Colors } from "@/utils/Colors";
import { GlobalStyles } from "@/utils/GlobalStyles";
import { useAuth } from "@/context/AuthContext";
import { Image } from "expo-image";
import { useDocumentStatus } from "@/hooks/useDocuments";
import { showToast } from "@/folder/toastService";
import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";

function CarItems({ item }: any) {
  const { width } = useWindowDimensions();
  // Ensure the card isn't monstrously large on a tablet
  const CARD_WIDTH = Math.min(width * 0.7, 320); 

  const { isSignedIn } = useAuth();
  const { data: favouritesData } = useFetchFavourites();
  const toggleFavourite = useToggleFavourite();
  const { data: docData } = useDocumentStatus();
  const currentStatus = docData?.docStatus || "unverified";

  const isFav = favouritesData?.carIds?.includes(item?._id);

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/screens/Others/CarLeaseDetails",
          params: { id: item._id },
        })
      }
      style={({ pressed }) => [pressed && { opacity: 0.95 }]}
    >
      <View style={[styles.carCard, { width: CARD_WIDTH }]}>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item?.images?.[0]?.url }}
            style={styles.carImage}
            contentFit="cover"
            transition={300}
            cachePolicy={"memory-disk"}
          />

          {/* Price Badge */}
          <View style={styles.priceBadge}>
            <Text style={styles.priceAmount}>${item.pricePerDay}</Text>
            <Text style={styles.priceUnit}>/day</Text>
          </View>

          {/* Discount Badge */}
          {item?.discountEnabled && item?.discountPercentage > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>{item.discountPercentage}% OFF</Text>
            </View>
          )}

          {/* Favorite Button */}
          <TouchableOpacity
            style={styles.favoriteBtn}
            onPress={() => toggleFavourite.mutate(item?._id)}
            activeOpacity={0.7}
          >
            <Icon
              name={isFav ? "heart" : "heart-outline"}
              color={isFav ? Colors.primary : Colors.white}
              size={20}
            />
          </TouchableOpacity>

          {/* Rented Badge */}
          {item?.available === false && (
            <View style={styles.rentedBadge}>
              <Icon name="lock-closed" size={12} color={Colors.white} />
              <Text style={styles.rentedBadgeText}>RENTED</Text>
            </View>
          )}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text numberOfLines={1} style={styles.carName}>
            {capitalText(item.modelName)}
          </Text>

          {/* Specs Row */}
          <View style={styles.specsRow}>
            <View style={styles.specItem}>
              <Icon name="people-outline" size={13} color="#94A3B8" />
              <Text style={styles.specText}>
                {item.seats || 5} Seats
              </Text>
            </View>
            <View style={styles.specDot} />
            <View style={styles.specItem}>
              <Icon name="speedometer-outline" size={13} color="#94A3B8" />
              <Text style={styles.specText}>
                {item.fuelType || "Petrol"}
              </Text>
            </View>
          </View>

          {/* Rent Button */}
          <TouchableOpacity
            style={[styles.rentButton, item?.available === false && styles.disabledButton]}
            activeOpacity={0.8}
            onPress={() => {
              if (item?.available === false) return;
              if (!isSignedIn) {
                router.push("/screens/Auth/SocialAuth");
                return;
              }
              if (currentStatus === "pending") {
                showToast("Your documents are under review. Please wait for approval.");
                return;
              }
              if (currentStatus !== "approved") {
                showToast("Please upload your documents to rent a car.");
                router.push("/screens/Setting/DocumentUploadScreen");
                return;
              }
              router.push({
                pathname: "/screens/Others/DateAndTime",
                params: { carId: item._id },
              });
            }}
            disabled={item?.available === false}
          >
            <Text style={styles.rentButtonText}>
              {item?.available === false ? "Currently Rented" : "Rent Now"}
            </Text>
            {item?.available !== false && <Icon name="arrow-forward" size={14} color="#FFF" />}
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
}

export default CarItems;

const styles = StyleSheet.create({
  carCard: {
    marginRight: 16,
    backgroundColor: Colors.white,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    ...GlobalStyles.shadowMedium,
  },
  imageContainer: {
    position: "relative",
  },
  carImage: {
    width: "100%",
    height: 165,
  },
  priceBadge: {
    position: "absolute",
    bottom: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "baseline",
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  priceAmount: {
    fontSize: RFValue(14),
    fontFamily: "bold",
    color: Colors.white,
  },
  priceUnit: {
    fontSize: RFValue(10),
    fontFamily: "medium",
    color: Colors.muted,
    marginLeft: 2,
  },
  favoriteBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  discountBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#D97706",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountBadgeText: {
    color: "#FFFFFF",
    fontSize: RFValue(9),
    fontFamily: "bold",
  },
  infoSection: {
    padding: 14,
  },
  carName: {
    fontSize: RFValue(14),
    fontFamily: "bold",
    color: Colors.primary,
    marginBottom: 8,
  },
  specsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  specItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  specText: {
    fontSize: RFValue(11),
    fontFamily: "medium",
    color: Colors.muted,
  },
  specDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#CBD5E1",
    marginHorizontal: 8,
  },
  rentButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  rentButtonText: {
    color: "#FFFFFF",
    fontSize: RFValue(11),
    fontFamily: "bold",
    letterSpacing: 0.3,
  },
  rentedBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: Colors.danger,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
    ...GlobalStyles.shadowLight,
  },
  rentedBadgeText: {
    color: Colors.white,
    fontSize: RFValue(9),
    fontFamily: "bold",
    letterSpacing: 0.5,
  },
  disabledButton: {
    backgroundColor: Colors.muted,
    opacity: 0.8,
  },
});
