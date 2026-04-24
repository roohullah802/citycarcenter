import { Colors } from "@/utils/Colors";
import { useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";


export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      router.replace("/(tabs)/Home");
    } else {
      const timer = setTimeout(() => {
        router.replace("/screens/Auth/SocialAuth");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isLoaded, isSignedIn]);

  return (
    <View style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#FFFFFF"
    }}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}
