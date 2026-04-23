import { useState, useEffect } from "react";
import { Alert } from "react-native";
import * as Location from "expo-location";

export type LocationData = Location.LocationObject | null;

const useLocationData = (): LocationData => {
  const [location, setLocation] = useState<LocationData>(null);

  useEffect(() => {
    let isActive = true;

    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (!isActive) return;

        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Location permission is required to show nearby cars.",
          );
          return;
        }

        const enabled = await Location.hasServicesEnabledAsync();
        if (!enabled && isActive) {
          Alert.alert(
            "Location Disabled",
            "Please enable location services in your device settings.",
          );
          return;
        }

        const currentPosition = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (isActive) {
          setLocation(currentPosition);
        }
      } catch (error: any) {
        if (!isActive) return;

        const errorMessage = error.message || "";
        if (errorMessage.includes("timeout")) {
          Alert.alert("Timeout", "Request to get location timed out.");
        } else {
          Alert.alert(
            "Error",
            "An unexpected error occurred while fetching location.",
          );
        }
        console.error("Location Error:", error);
      }
    };

    getLocation();

    return () => {
      isActive = false;
    };
  }, []);

  return location;
};

export { useLocationData };
