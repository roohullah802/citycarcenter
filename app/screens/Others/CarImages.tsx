import { useCarById } from "@/hooks/useFetchCars";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

function CarImages() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
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
        <ActivityIndicator color="rgba(31, 48, 94, 0.88)" size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Ionicons name="cloud-offline-outline" size={48} color="#FF6B6B" />
        <Text style={styles.errorText}>Gallery Sync Failed</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* REFINED OVERLAY HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          style={styles.closeCircle}
        >
          <Ionicons name="close" color="white" size={24} />
        </TouchableOpacity>

        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>
            {`${activeIndex + 1} / ${images.length}`}
          </Text>
        </View>

        <View style={{ width: 44 }} />
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
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={2}
        removeClippedSubviews={true}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const IndividualImage = ({ url }: { url: string }) => {
  const [isImgLoading, setIsImgLoading] = useState(true);

  return (
    <View style={styles.imageWrapper}>
      {isImgLoading && (
        <View style={styles.imageLoader}>
          <ActivityIndicator color="rgba(31, 48, 94, 0.88)" size="small" />
        </View>
      )}
      <Image
        source={{ uri: url }}
        contentFit="contain"
        transition={300}
        cachePolicy={"memory-disk"}
        style={styles.fullImage}
        onLoadEnd={() => setIsImgLoading(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  centered: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  counterBadge: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  counterText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 1,
  },
  listContent: {
    alignItems: "center",
  },
  imageWrapper: {
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: width,
    height: "100%",
  },
  imageLoader: {
    position: "absolute",
    zIndex: 1,
  },
  errorText: {
    color: "#94A3B8",
    marginTop: 12,
    fontWeight: "600",
  },
  retryBtn: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: "rgba(115, 194, 251, 0.2)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(31, 48, 94, 0.88)",
  },
  retryText: {
    color: "rgba(31, 48, 94, 0.88)",
    fontWeight: "800",
  },
});

export default CarImages;
