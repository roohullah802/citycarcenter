import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Colors } from "@/utils/Colors";
import { RFValue } from "react-native-responsive-fontsize";

interface Props {
  item: {
    brandImage: [string] | { url: string };
    brand: string;
  };
}

const BrandCard: React.FC<Props> = React.memo(({ item }) => {
  const { width } = useWindowDimensions();
  
  // Calculate columns based on width
  const columns = width < 500 ? 4 : width < 800 ? 6 : 8;
  // Screen padding = 20 * 2 = 40. Gap = 12 between items.
  const ITEM_WIDTH = Math.floor((width - 40 - (12 * (columns - 1))) / columns);

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
    fontSize: RFValue(16),
    fontWeight: "800",
    color: Colors.primary,
  },
  brandName: {
    fontSize: RFValue(9),
    fontWeight: "700",
    color: Colors.primary,
    marginTop: 6,
    textAlign: "center",
    textTransform: "capitalize",
  },
});

BrandCard.displayName = "BrandCard";

export default BrandCard;
