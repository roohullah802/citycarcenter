import { router } from "expo-router";
import { Dimensions, Image, Pressable, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");

export const ImageItem = ({ item, HEADER_HEIGHT, id }: any) => {
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/screens/Others/CarImages",
          params: { id },
        })
      }
    >
      <View style={[styles.carImageContainer, { height: HEADER_HEIGHT }]}>
        <Image
          source={{ uri: item?.url }}
          style={{ width: width, height: HEADER_HEIGHT }}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  carImageContainer: {
    width,
    position: "relative",
  },
});
