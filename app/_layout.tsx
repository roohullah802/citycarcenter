import ToastProvider from "@/folder/toastService";
import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/expo";
import { StripeProvider } from "@stripe/stripe-react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { tokenCache } from "../folder/tokenCache";
import "../utils/pollyFills";
import StackLayout from "./Stack";
import { StatusBar } from "expo-status-bar";
import { FavoritesProvider } from "../context/FavoutiteContext";

export const unstable_settings = {
  anchor: "(tabs)",
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
        <ActivityIndicator size={"large"} />
      </SafeAreaView>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
        <ClerkLoading>
          <SafeAreaView style={style.cnt}>
            <ActivityIndicator size="large" />
          </SafeAreaView>
        </ClerkLoading>
        <ClerkLoaded>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <QueryClientProvider client={queryClient}>
              <FavoritesProvider>
                <ToastProvider>
                  <StripeProvider
                    publishableKey={process.env.STRIPE_PUBLISHABLE_KEY!}
                  >
                    <StackLayout />
                  </StripeProvider>
                </ToastProvider>
              </FavoritesProvider>
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
