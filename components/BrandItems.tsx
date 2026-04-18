import { router } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

function BrandItems({ item }: any) {
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/screens/Others/CarCardsByBrand",
          params: { brand: item.brand },
        })
      }
    >
      <View style={styles.brandIconContainer}>
        <Image
          source={{ uri: item.brandImage }}
          style={styles.brandIcon}
          resizeMode="contain"
        />
      </View>
    </Pressable>
  );
}

export default BrandItems;

const styles = StyleSheet.create({
  brandIconContainer: {
    width: 65,
    height: 70,
    borderRadius: 10,
    borderWidth: 0.3,
    borderColor: "#C0C0C0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 10,
  },
  brandIcon: {
    width: 45,
    height: 45,
  },
});
