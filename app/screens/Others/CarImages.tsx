import { useCarById } from "@/hooks/useFetchCars";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useRef } from "react";
import {
  FlatList,
  TouchableOpacity,
  View,
  Dimensions,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");

function CarImages() {
  const { id } = useLocalSearchParams();
  const { data, isLoading, isError, refetch } = useCarById(id as string);

  const images = data?.data?.[0]?.images || [];
  const [activeIndex, setActiveIndex] = useState(0);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#73C2FB" size="large" />
        <Text style={styles.infoText}>Loading...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Icon name="cloud-offline-outline" size={50} color="#FF6B6B" />
        <Text style={styles.errorText}>Error loading images</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="close" color="white" size={30} />
        </TouchableOpacity>

        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>
            {`${activeIndex + 1} / ${images.length}`}
          </Text>
        </View>

        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <IndividualImage url={item?.url} />}
      />
    </View>
  );
}

const IndividualImage = ({ url }: { url: string }) => {
  const [loading, setLoading] = useState(true);

  return (
    <View style={styles.imageWrapper}>
      {loading ? (
        <View style={styles.imageLoader}>
          <ActivityIndicator color="#73C2FB" size="small" />
        </View>
      ) : null}
      <Image
        source={{ uri: url }}
        contentFit="contain"
        style={styles.fullImage}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  centered: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginTop: 60,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backBtn: { width: 40 },
  placeholder: { width: 40 },
  counterBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
  },
  counterText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  imageWrapper: {
    width: width,
    height: height * 0.7,
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: { width: width, height: "100%" },
  imageLoader: { position: "absolute", zIndex: 1 },
  infoText: { color: "#73C2FB", marginTop: 10 },
  errorText: { color: "#999", marginTop: 10 },
  retryBtn: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#333",
    borderRadius: 8,
  },
  retryText: { color: "#73C2FB", fontWeight: "bold" },
});

export default CarImages;
