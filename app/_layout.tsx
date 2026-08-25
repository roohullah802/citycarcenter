import ToastProvider from "@/folder/toastService";
import { Colors } from "@/utils/Colors";
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
import { AuthProvider } from "@/context/AuthContext";
import { useNetworkMonitor } from "@/hooks/useNetworkMonitor";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

const publishableStripeKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!


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
      <AuthProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <QueryClientProvider client={queryClient}>
            <ToastProvider>
              <NetworkMonitor />
              <StripeProvider
                publishableKey={
                  publishableStripeKey
                }
              >
                <Stack
                  screenOptions={{
                    headerShown: false,
                    animation: "fade_from_bottom"
                  }}
                />
              </StripeProvider>
            </ToastProvider>
          </QueryClientProvider>
        </GestureHandlerRootView>
      </AuthProvider>
    </>
  );
}

/** Renders nothing – just activates the network listener inside ToastProvider */
function NetworkMonitor() {
  useNetworkMonitor();
  return null;
}

const style = StyleSheet.create({
  cnt: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
