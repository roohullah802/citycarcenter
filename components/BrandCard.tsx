import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "@/utils/Colors";

interface Props {
  item: {
    brandImage: [string] | { url: string };
    brand: string;
  };
}

const { width } = Dimensions.get("window");
// Screen padding = 20 * 2 = 40. Gap between 4 columns = 12 * 3 = 36.
const ITEM_WIDTH = Math.floor((width - 40 - 36) / 4);

const BrandCard: React.FC<Props> = React.memo(({ item }) => {
  const imageUrl = (item?.brandImage as any)?.url || (item?.brandImage as any);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.cardContainer, { width: ITEM_WIDTH }]}
      onPress={() =>
        router.push({
          pathname: "/screens/Others/CarCardsByBrand",
          params: { brand: item?.brand },
        })
      }
    >
      <View style={[styles.card, { height: ITEM_WIDTH }]}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            contentFit="contain"
            transition={200}
            cachePolicy={"memory-disk"}
          />
        ) : (
          <Text style={styles.fallbackText}>{item?.brand?.charAt(0)?.toUpperCase()}</Text>
        )}
      </View>
      <Text numberOfLines={1} style={styles.brandName}>
        {item?.brand}
      </Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    alignItems: "center",
  },
  card: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  image: {
    width: "80%",
    height: "80%",
  },
  fallbackText: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.primary,
  },
  brandName: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.primary,
    marginTop: 6,
    textAlign: "center",
    textTransform: "capitalize",
  },
});

BrandCard.displayName = "BrandCard";

export default BrandCard;
