import { capitalText } from "@/folder/capitalText";
import { useFetchFavourites, useToggleFavourite } from "@/hooks/useFavourites";
import { Colors } from "@/utils/Colors";
import { useAuth } from "@/context/AuthContext";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useDocumentStatus } from "@/hooks/useDocuments";
import { showToast } from "@/folder/toastService";
import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

function CarCards({ item }: any) {
  const { data: favouritesData } = useFetchFavourites();
  const toggleFavourite = useToggleFavourite();
  const { isSignedIn } = useAuth();
  const { data: docData } = useDocumentStatus();
  const currentStatus = docData?.docStatus || "unverified";

  const isFav = favouritesData?.carIds?.includes(item?._id);

  return (
    <Pressable
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      onPress={() =>
        router.push({
          pathname: "/screens/Others/CarLeaseDetails",
          params: { id: item?._id },
        })
      }
    >
      <View style={styles.card}>
        {/* Car Image Section */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: item?.images?.[0]?.url }}
            style={styles.image}
            contentFit="cover"
            transition={300}
            cachePolicy={"memory-disk"}
          />

          {item?.available === false && (
            <View style={styles.rentedBadge}>
              <Text style={styles.rentedBadgeText}>RENTED</Text>
            </View>
          )}

          {item?.discountEnabled && item?.discountPercentage > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>{item.discountPercentage}% OFF</Text>
            </View>
          )}
        </View>

        {/* Car Details Section */}
        <View style={styles.details}>
          <View style={styles.topInfo}>
            {item?.brand ? (
              <Text style={styles.brandText} numberOfLines={1}>
                {capitalText(item.brand)}
              </Text>
            ) : null}
            <Text style={styles.name} numberOfLines={1}>
              {capitalText(item.modelName)}
            </Text>

            <View style={styles.priceRow}>
              <Text style={styles.priceAmount}>${item.pricePerDay}</Text>
              <Text style={styles.priceUnit}>/day</Text>
            </View>

            <View style={styles.ratingRow}>
              <Icon name="star" size={13} color="#F59E0B" />
              <Text style={styles.ratingText}>
                {item.totalReviews ? `(${item.totalReviews} reviews)` : "New"}
              </Text>
            </View>
          </View>

          {/* Actions Row */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.rentBtn, item?.available === false && styles.disabledBtn]}
              disabled={item?.available === false}
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
                    params: { carId: item?._id },
                  });
                }
              }}
            >
              <Text style={styles.rentBtnText}>
                {item?.available === false ? "Rented" : "Rent Now"}
              </Text>
              {item?.available !== false && (
                <Icon name="arrow-forward" size={12} color="#FFF" style={{ marginLeft: 3 }} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.heartBtn}
              onPress={() => toggleFavourite.mutate(item?._id)}
              activeOpacity={0.7}
            >
              <Icon
                name={isFav ? "heart" : "heart-outline"}
                color={isFav ? Colors.primary : "#94A3B8"}
                size={18}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default CarCards;

const styles = StyleSheet.create({
  pressable: {
    width: "100%",
    marginBottom: 14,
  },
  pressed: {
    opacity: 0.95,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    overflow: "hidden",
    height: 145,
    ...Platform.select({
      ios: {
        shadowColor: "rgba(31, 48, 94, 0.12)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: { elevation: 3 },
    }),
  },
  imageWrapper: {
    width: "42%",
    height: "100%",
    position: "relative",
    backgroundColor: "#F8FAFC",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  rentedBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: Colors.danger,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    zIndex: 10,
  },
  rentedBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontFamily: "bold",
    letterSpacing: 0.5,
  },
  discountBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "#D97706",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    zIndex: 10,
  },
  discountBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontFamily: "bold",
  },
  details: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },
  topInfo: {
    gap: 2,
  },
  brandText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  name: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.primary,
    lineHeight: 20,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 4,
  },
  priceAmount: {
    fontSize: 15,
    fontWeight: "800",
    color: "#059669",
  },
  priceUnit: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
    marginLeft: 2,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
    gap: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 4,
  },
  rentBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  rentBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  disabledBtn: {
    backgroundColor: Colors.muted,
    opacity: 0.7,
  },
  heartBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
});
