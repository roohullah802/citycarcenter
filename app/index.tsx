import { Redirect, router, useLocalSearchParams } from "expo-router";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { useAuth } from "@clerk/expo";
import { useEffect, useState } from "react";
import { Colors } from "@/utils/Colors";

export default function Index() {
  const params = useLocalSearchParams();
  const { isLoaded, isSignedIn } = useAuth({ treatPendingAsSignedOut: false });
  const isOAuthCallback = params.oauth === "true";
  const [callbackResolved, setCallbackResolved] = useState(false);

  useEffect(() => {
    if (!isOAuthCallback || !isLoaded) {
      setCallbackResolved(false);
      return;
    }

    const timer = setTimeout(() => {
      setCallbackResolved(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [isOAuthCallback, isLoaded]);

  useEffect(() => {
    if (!isOAuthCallback || !callbackResolved || !isLoaded) return;

    if (isSignedIn) {
      router.replace("/(tabs)/Home");
      return;
    }

    router.replace("/screens/Auth/SocialAuth");
  }, [isOAuthCallback, callbackResolved, isLoaded, isSignedIn]);

  if (!isLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  if (isOAuthCallback && !callbackResolved) {
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
