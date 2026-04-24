import { useFavorites } from "@/context/FavoutiteContext";
import { useAuth } from "@clerk/expo";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

function CarCards({ item }: any) {
  const { handleFav, isFavourite } = useFavorites();
  const { isSignedIn } = useAuth();

  const isFav = isFavourite(item?._id);
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
        <Image
          source={{ uri: item?.images?.[0]?.url }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.details}>
          <Text style={styles.name} numberOfLines={1}>
            {item.modelName}
          </Text>
          <Text style={styles.price} numberOfLines={1}>
            Price: ${item.pricePerDay}/day
          </Text>

          <View style={styles.rating}>
            <Icon name="star" size={16} color="#fbbf24" />
            <Text style={styles.ratingText}>({item.totalReviews} Reviews)</Text>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.rentBtn}
              onPress={() => {
                if (!isSignedIn) {
                  router.push("/screens/Auth/SocialAuth");
                } else {
                  router.push({
                    pathname: "/screens/Others/DateAndTime",
                    params: { carId: item?._id },
                  });
                }
              }}
            >
              <Text style={styles.rentBtnText}>Rent Now</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.heartBtn}
              onPress={() => handleFav(item?._id)}
            >
              <Icon
                name={isFav ? "heart" : "heart-outline"}
                color="rgba(31, 48, 94, 0.88)"
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
  heartBtn: {
    padding: 8,
    backgroundColor: "#eef5ff",
    borderRadius: 50,
  },
  rentBtn: {
    backgroundColor: "rgba(31, 48, 94, 0.88)",
    width: 90,
    paddingVertical: 7,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  rentBtnText: {
    fontSize: 10,
    fontFamily: "demiBold",
    color: "white",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 7,
    color: "#3f3f3fff",
    fontFamily: "demiBold",
    marginLeft: 4,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  image: {
    width: "55%",
    height: "100%",
  },
  details: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3f3f3fff",
    fontFamily: "bold",
  },
  price: {
    fontSize: 10,
    fontWeight: "600",
    color: "#3f3f3fff",
    fontFamily: "bold",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#98817B",
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
    overflow: "hidden",
    height: 130,
    width: "99%",
  },
  pressable: {
    width: "100%",
  },
  pressed: {
    opacity: 0.9,
  },
});
