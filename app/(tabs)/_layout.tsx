import { Redirect, Tabs } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View, Platform, StyleSheet } from "react-native";
import { useAuth } from "@clerk/expo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { setAuthToken } from "@/folder/axiosInstance";
import { Colors } from "@/utils/Colors";

export default function TabLayout() {
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

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const activeColor = Colors.primary;
  const inactiveColor = "#94A3B8";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#F1F5F9",
          height: Platform.OS === "ios" ? 85 + insets.bottom / 2 : 70 + insets.bottom,
          paddingTop: 10,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
          elevation: 0, // Clean look on Android
          shadowOpacity: 0, // Clean look on iOS
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          fontFamily: "medium",
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              size={24} 
              name={focused ? "home" : "home-outline"} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Leases"
        options={{
          title: "Leases",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              size={24} 
              name={focused ? "car-sport" : "car-sport-outline"} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="FavouriteCars"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              size={24} 
              name={focused ? "heart" : "heart-outline"} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Setting"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              size={24} 
              name={focused ? "settings" : "settings-outline"} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "#FFFFFF"
  }
});
