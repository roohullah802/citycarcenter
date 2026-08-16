import { Redirect, router, useLocalSearchParams } from "expo-router";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { useAuth } from "@clerk/expo";
import { useEffect } from "react";
import { Colors } from "@/utils/Colors";

export default function Index() {
  const params = useLocalSearchParams();
  const { isLoaded, isSignedIn } = useAuth({ treatPendingAsSignedOut: false });
  const isOAuthCallback = params.oauth === "true";

  useEffect(() => {
    if (!isLoaded || !isOAuthCallback) return;

    if (isSignedIn) {
      router.replace("/(tabs)/Home");
      return;
    }

    router.replace("/screens/Auth/SocialAuth");
  }, [isLoaded, isOAuthCallback, isSignedIn]);

  if (!isLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  if (isOAuthCallback) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.text}>Authenticating...</Text>
      </View>
    );
  }

  if (isSignedIn) {
    return <Redirect href="/(tabs)/Home" />;
  }

  return <Redirect href="/screens/Auth/SocialAuth" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  }
});
