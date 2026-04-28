import { useFetchFavourites, useToggleFavourite } from "@/hooks/useFavourites";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Colors } from "@/utils/Colors";
import { GlobalStyles } from "@/utils/GlobalStyles";

function FavCars({ item }: any) {
  const { data: favouritesData } = useFetchFavourites();
  const toggleFavourite = useToggleFavourite();
  const isFav = favouritesData?.carIds?.includes(item?._id);

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.cardWrapper,
          pressed && { opacity: 0.95 },
        ]}
        onPress={() =>
          router.push({
            pathname: "/screens/Others/CarLeaseDetails",
            params: { id: item?._id },
          })
        }
      >
        <View style={styles.card}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item?.images?.[0]?.url }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.priceBadge}>
              <Text style={styles.priceAmount}>${item?.pricePerDay}</Text>
              <Text style={styles.priceUnit}>/day</Text>
            </View>

            {/* Rented Badge */}
            {item?.available === false && (
              <View style={styles.rentedBadge}>
                <Icon name="lock-closed" size={12} color={Colors.white} />
                <Text style={styles.rentedBadgeText}>RENTED</Text>
              </View>
            )}
          </View>

          <View style={styles.details}>
            <View style={styles.headerRow}>
              <Text style={styles.name} numberOfLines={1}>
                {item?.modelName}
              </Text>
              <TouchableOpacity
                style={styles.heartBtn}
                onPress={() => toggleFavourite.mutate(item._id)}
                activeOpacity={0.7}
              >
                <Icon
                  name={isFav ? "heart" : "heart-outline"}
                  color={isFav ? Colors.primary : Colors.muted}
                  size={20}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.specsRow}>
              <View style={styles.specItem}>
                <Icon name="people-outline" size={13} color="#94A3B8" />
                <Text style={styles.specText}>{item?.seats || 5} Seats</Text>
              </View>
              <View style={styles.specDot} />
              <View style={styles.specItem}>
                <Icon name="speedometer-outline" size={13} color="#94A3B8" />
                <Text style={styles.specText}>{item?.fuelType || "Petrol"}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.rentBtn, item?.available === false && styles.disabledBtn]}
              activeOpacity={0.8}
              onPress={() => {
                if (item?.available === false) return;
                router.push({
                  pathname: "/screens/Others/DateAndTime",
                  params: { carId: item?._id },
                });
              }}
              disabled={item?.available === false}
            >
              <Text style={styles.rentBtnText}>
                {item?.available === false ? "Currently Rented" : "Rent Now"}
              </Text>
              {item?.available !== false && <Icon name="arrow-forward" size={14} color="#FFF" />}
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

export default FavCars;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  cardWrapper: {
    width: "100%",
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    ...GlobalStyles.shadowMedium,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 160,
  },
  image: {
    width: "100%",
    height: "100%",
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
    fontSize: 16,
    fontFamily: "bold",
    color: "#FFFFFF",
  },
  priceUnit: {
    fontSize: 11,
    fontFamily: "medium",
    color: "#94A3B8",
    marginLeft: 2,
  },
  details: {
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: "rgba(31, 48, 94, 0.88)",
  },
  heartBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  specsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  specItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  specText: {
    fontSize: 12,
    fontFamily: "medium",
    color: "#94A3B8",
  },
  specDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#CBD5E1",
    marginHorizontal: 8,
  },
  rentBtn: {
    flexDirection: "row",
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  rentBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
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
    fontSize: 10,
    fontFamily: "bold",
    letterSpacing: 0.5,
  },
  disabledBtn: {
    backgroundColor: Colors.muted,
    opacity: 0.8,
  },
});
