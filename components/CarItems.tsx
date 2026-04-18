import { useFavorites } from "@/context/FavoutiteContext";
import { capitalText } from "@/folder/capitalText";
import { useAuth } from "@clerk/expo";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

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
    >
      <View style={styles.carCard}>
        <Image
          source={{ uri: item?.images?.[0]?.url }}
          style={styles.carImage}
          resizeMode="cover"
        />

        <Text numberOfLines={1} style={styles.carName}>
          {capitalText(item.modelName)}
        </Text>

        <View style={styles.carFooter}>
          <Text style={styles.carPrice}>${item.pricePerDay}/day</Text>

          <TouchableOpacity
            style={styles.leaseButton}
            onPress={() => {
              if (!isSignedIn) {
                router.push("/screens/Auth/SocialAuth");
              } else {
                router.push({
                  pathname: "/screens/Others/DateAndTime",
                  params: { carId: item._id },
                });
              }
            }}
          >
            <Text style={styles.leaseButtonText}>Rent Now</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.favoriteIcon}>
          <TouchableOpacity onPress={() => handleFav(item?._id)}>
            <Icon
              name={isFav ? "heart" : "heart-outline"}
              color="#73C2FB"
              size={26}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
}

export default CarItems;

const styles = StyleSheet.create({
  favoriteIcon: {
    position: "absolute",
    top: 20,
    right: 10,
  },

  leaseButtonText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "600",
  },
  leaseButton: {
    backgroundColor: "#73C2FB",
    paddingHorizontal: 20,
    paddingVertical: 17,
    borderRadius: 8,
  },

  carPrice: {
    fontSize: 11,
    color: "#3f3f3fff",
    fontFamily: "demiBold",
  },

  carFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },

  carName: {
    fontSize: 15,
    marginTop: 10,
    fontFamily: "bold",
    color: "#3f3f3fff",
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20,
  },
  carImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  carCard: {
    width: width * 0.62,
    marginRight: 16,
    backgroundColor: "#eef5ff",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 55,
    paddingBottom: 10,
  },
});
