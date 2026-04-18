import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

function NoFavCars() {
  return (
    <View style={styles.centered}>
      <Icon name="information-circle-outline" size={40} color="#ccc" />
      <Text style={styles.message}>
        No Favourite Cars available at the moment.
      </Text>
    </View>
  );
}

export default NoFavCars;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 250,
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginTop: 8,
    fontFamily: "medium",
  },
});
