import { useAuth } from "@/context/AuthContext";
import { Colors } from "@/utils/Colors";
import { Image } from "expo-image";
import * as AppleAuthentication from "expo-apple-authentication";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";

export default function SignInWithApple() {
  const [loading, setLoading] = useState<boolean>(false);
  const { loginWithApple } = useAuth();

  const handlePress = async () => {
    setLoading(true);
    try {
      // Using Apple's native sign-in
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential.identityToken || credential.user) {
        // Extract user info from Apple credential
        const appleId = credential.user;
        const name = credential.fullName?.givenName || "User";
        const email = credential.email || `${appleId}@apple.local`;
        const profileImage = ""; // Apple doesn't provide profile image
        const identityToken = credential.identityToken;

        await loginWithApple(identityToken, appleId, name, email, profileImage);
        router.replace("/");
      }
    } catch (error: any) {
      if (error.code === "ERR_CANCELED") {
        console.log("Apple sign-in cancelled");
      } else {
        console.log("Apple Auth Error:", error.message || error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        style={[styles.button, { height: 56 }]}
      >
        <View style={styles.iconWrap}>
          <Image
            source={require("../../../assests/apple.png")}
            style={styles.icon}
            transition={300}
            contentFit="contain"
            cachePolicy={"memory-disk"}
          />
        </View>
        <View style={styles.labelWrap}>
          <Text style={styles.buttonLabel}>
            Sign-in with Apple
          </Text>
        </View>
      </TouchableOpacity>

      <Modal visible={loading} transparent animationType="fade">
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Authenticating...</Text>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    paddingHorizontal: 14,
    borderWidth: 0.2,
    borderColor: "gray",
    marginBottom: 12,
  },
  iconWrap: { width: 48, alignItems: "center", justifyContent: "center" },
  icon: { width: 28, height: 28 },
  labelWrap: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 6,
  },
  buttonLabel: {
    color: "#222",
    fontWeight: "600",
    letterSpacing: -0.6,
    fontSize: 12,
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(31, 48, 94, 0.88)",
  }
});
