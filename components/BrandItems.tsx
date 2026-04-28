import { router } from "expo-router";
import React from "react";
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

function BrandItems({ item }: any) {
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/screens/Others/CarCardsByBrand",
          params: { brand: item.brand },
        })
      }
      style={({ pressed }) => [
        styles.brandCard,
        pressed && styles.brandCardPressed,
      ]}
    >
      <View style={styles.brandIconContainer}>
        <Image
          source={{ uri: item.brandImage?.url || item.brandImage }}
          style={styles.brandIcon}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.brandName} numberOfLines={1}>
        {item.brand}
      </Text>
    </Pressable>
  );
}

export default BrandItems;

const styles = StyleSheet.create({
  brandCard: {
    width: 80,
    alignItems: "center",
    marginRight: 14,
    marginBottom: 10,
  },
  brandCardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  brandIconContainer: {
    width: 68,
    height: 68,
    borderRadius: 18,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEF2F6",
    ...Platform.select({
      ios: {
        shadowColor: "#94A3B8",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  brandIcon: {
    width: 42,
    height: 42,
  },
  brandName: {
    fontSize: 11,
    fontFamily: "medium",
    color: "#475569",
    marginTop: 8,
    textAlign: "center",
    letterSpacing: -0.2,
  },
});
