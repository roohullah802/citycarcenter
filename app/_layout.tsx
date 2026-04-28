import ToastProvider from "@/folder/toastService";
import { Colors } from "@/utils/Colors";
import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/expo";
import { StripeProvider } from "@stripe/stripe-react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import "react-native-url-polyfill/auto";
import { tokenCache } from "../folder/tokenCache";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    regular: require("../assests/fonts/TTHoves-Regular.ttf"),
    medium: require("../assests/fonts/TTHoves-Medium.ttf"),
    demiBold: require("../assests/fonts/TTHoves-DemiBold.ttf"),
    bold: require("../assests/fonts/TTHoves-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={style.cnt}>
        <ActivityIndicator size={"large"} color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
        <ClerkLoading>
          <SafeAreaView style={style.cnt}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </SafeAreaView>
        </ClerkLoading>
        <ClerkLoaded>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <QueryClientProvider client={queryClient}>
              <ToastProvider>
                <StripeProvider
                  publishableKey={
                    process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!
                  }
                >
                    <Stack
                      screenOptions={{ 
                        headerShown: false, 
                        animation: "fade_from_bottom" 
                      }}
                    >
                      <Stack.Screen name="(tabs)" />
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
                </StripeProvider>
              </ToastProvider>
            </QueryClientProvider>
          </GestureHandlerRootView>
        </ClerkLoaded>
      </ClerkProvider>
    </>
  );
}

const style = StyleSheet.create({
  cnt: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
