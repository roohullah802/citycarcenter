import { useFavorites } from "@/context/FavoutiteContext";
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

function FavCars({ item }: any) {
  const { isFavourite, handleFav } = useFavorites();
  const isFav = isFavourite(item?._id);

  return (
    <View style={{ marginTop: 30 }}>
      <Pressable
        style={({ pressed }) => [
          styles.cardWrapper,
          pressed && styles.cardPressed,
        ]}
        onPress={() =>
          router.push({
            pathname: "/screens/Others/CarLeaseDetails",
            params: { id: item?._id },
          })
        }
      >
        <View style={styles.card}>
          <Image
            source={{ uri: item?.images?.[0].url }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.details}>
            <Text style={styles.name} numberOfLines={1}>
              {item?.modelName}
            </Text>
            <Text style={styles.price} numberOfLines={1}>
              Price: ${item?.pricePerDay}/day
            </Text>

            <View style={styles.rating}>
              <Icon name="star" size={16} color="#fbbf24" />
              <Text style={styles.ratingText}>
                ({item?.totalReviews} Reviews)
              </Text>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.rentBtn}
                onPress={() =>
                  router.push({
                    pathname: "/screens/Others/DateAndTime",
                    params: { carId: item?._id },
                  })
                }
              >
                <Text style={styles.rentBtnText}>Rent Now</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.heartBtn}
                onPress={() => handleFav(item._id)}
              >
                <Icon
                  name={isFav ? "heart" : "heart-outline"}
                  color="#73C2FB"
                  size={18}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

export default FavCars;

const styles = StyleSheet.create({
  heartBtn: {
    padding: 8,
    backgroundColor: "#eef5ff",
    borderRadius: 50,
  },
  rentBtn: {
    backgroundColor: "#73C2FB",
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
  ratingText: {
    fontSize: 7,
    color: "#3f3f3fff",
    fontFamily: "demiBold",
    marginLeft: 4,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
    fontFamily: "bold",
  },
  price: {
    fontSize: 10,
    fontWeight: "600",
    color: "#3f3f3fff",
    fontFamily: "bold",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
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
  cardPressed: {
    opacity: 0.9,
  },

  cardWrapper: {
    width: "100%",
  },
});
