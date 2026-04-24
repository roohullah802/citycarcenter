import { Redirect, Tabs } from "expo-router";
import React, { useEffect } from "react";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuth } from "@clerk/expo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { setAuthToken } from "@/folder/axiosInstance";
import { ActivityIndicator, View } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { getToken, isLoaded, isSignedIn } = useAuth({
    treatPendingAsSignedOut: false,
  });

  useEffect(() => {
    async function syncToken() {
      const token = await getToken();

      setAuthToken(token);
    }

    if (isSignedIn) syncToken();
  }, [getToken, isSignedIn, isLoaded]);

  useEffect(() => {
    const loadUser = () => {
      if (!isSignedIn) {
        return <Redirect href={"/screens/Auth/SocialAuth"} />;
      }
    };
    loadUser();
  }, [isSignedIn]);

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="rgba(31, 48, 94, 0.88)" />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          backgroundColor: Colors[colorScheme ?? "light"].background,
        },
        tabBarLabelStyle: { fontSize: 10, marginBottom: 0 },
        tabBarIconStyle: { width: 25, height: 25 },
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Icon size={25} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Leases"
        options={{
          title: "Leases",
          tabBarIcon: ({ color }) => (
            <Icon size={25} name="stopwatch" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="FavouriteCars"
        options={{
          title: "Favourite",
          tabBarIcon: ({ color }) => (
            <Icon size={25} name="heart" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Setting"
        options={{
          title: "Setting",
          tabBarIcon: ({ color }) => (
            <Icon size={25} name="settings" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
