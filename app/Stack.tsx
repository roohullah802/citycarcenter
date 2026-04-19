import { setAuthToken } from "@/folder/axiosInstance";
import { useAuth, useUser } from "@clerk/expo";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function StackLayout() {
  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    async function syncToken() {
      const token = await getToken();
      setAuthToken(token);
    }

    if (isSignedIn) syncToken();
  }, [getToken, isSignedIn]);

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{ headerShown: false, animation: "fade_from_bottom" }}
    >
      <Stack.Screen name="(tabs)" />
      {/* Other screens */}
      <Stack.Screen name="screens/Others/BrandCards" />
      <Stack.Screen name="screens/Others/SearchCarCards" />
      <Stack.Screen name="screens/Others/CarCardsByBrand" />
      <Stack.Screen name="screens/Setting/PrivatePolicy" />
      <Stack.Screen name="screens/Setting/Report" />
      <Stack.Screen name="screens/Lease/ExtendLease" />
      <Stack.Screen name="screens/Others/CarLeaseDetails" />
      <Stack.Screen name="screens/Others/DateAndTime" />
      <Stack.Screen name="screens/Lease/LeaseDetails" />
      <Stack.Screen name="screens/Payments/PaymentDetails" />
      <Stack.Screen name="screens/Payments/PaymentSuccess" />
      <Stack.Screen name="screens/Auth/SocialAuth" />
      <Stack.Screen name="screens/Others/CarImages" />
      <Stack.Screen name="screens/Setting/DocumentUploadScreen" />
      <Stack.Screen name="screens/Setting/DocumentSubmittedScreen" />
    </Stack>
  );
}
