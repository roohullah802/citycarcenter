import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="rgba(31, 48, 94, 0.88)" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/screens/Auth/SocialAuth" />;
  }

  return <Redirect href="/(tabs)/Home" />;
}
