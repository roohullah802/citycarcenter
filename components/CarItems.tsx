import { useFavorites } from "@/context/FavoutiteContext";
import { capitalText } from "@/folder/capitalText";
import { useAuth } from "@clerk/expo";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.7;

function CarItems({ item }: any) {
  const { isSignedIn } = useAuth();
  const { handleFav, isFavourite } = useFavorites();

  const isFav = isFavourite(item?._id);

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
      <View style={styles.carCard}>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item?.images?.[0]?.url }}
            style={styles.carImage}
            resizeMode="cover"
          />

          {/* Price Badge */}
          <View style={styles.priceBadge}>
            <Text style={styles.priceAmount}>${item.pricePerDay}</Text>
            <Text style={styles.priceUnit}>/day</Text>
          </View>

          {/* Favorite Button */}
          <TouchableOpacity
            style={styles.favoriteBtn}
            onPress={() => handleFav(item?._id)}
            activeOpacity={0.7}
          >
            <Icon
              name={isFav ? "heart" : "heart-outline"}
              color={isFav ? "#EF4444" : "#FFFFFF"}
              size={20}
            />
          </TouchableOpacity>
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
            style={styles.rentButton}
            activeOpacity={0.8}
            onPress={() => {
              if (!isSignedIn) {
                router.push("/screens/Auth/SocialAuth");
                return;
              }
              router.push({
                pathname: "/screens/Others/DateAndTime",
                params: { carId: item._id },
              });
            }}
          >
            <Text style={styles.rentButtonText}>Rent Now</Text>
            <Icon name="arrow-forward" size={14} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
}

export default CarItems;

const styles = StyleSheet.create({
  carCard: {
    width: CARD_WIDTH,
    marginRight: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...Platform.select({
      ios: {
        shadowColor: "rgba(31, 48, 94, 0.88)",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
      android: {
        elevation: 5,
      },
    }),
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
    backgroundColor: "rgba(31, 48, 94, 0.88)",
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
  infoSection: {
    padding: 14,
  },
  carName: {
    fontSize: 16,
    fontFamily: "bold",
    color: "rgba(31, 48, 94, 0.88)",
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
  rentButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(31, 48, 94, 0.88)",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  rentButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: "bold",
    letterSpacing: 0.3,
  },
});
