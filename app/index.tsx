import { Redirect } from "expo-router";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { Colors } from "@/utils/Colors";

export default function Index() {
  const { isLoading, isSignedIn } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.text}>Loading...</Text>
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
