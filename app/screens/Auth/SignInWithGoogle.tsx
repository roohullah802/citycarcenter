import { Colors } from "@/utils/Colors";
import { useAuth } from "@/context/AuthContext";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export default function SignInWithGoogle() {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    });
  }, []);

  const handlePress = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo: any = await GoogleSignin.signIn();
      const idToken = userInfo?.data?.idToken || userInfo?.idToken;

      if (idToken) {
        // We only pass the idToken to the backend now, as the backend will verify it
        // and extract the user's name, email, etc. directly from Google's servers.
        await loginWithGoogle(idToken);
        router.replace("/");
      } else {
        throw new Error("No ID token received from Google");
      }
    } catch (error: any) {
      if (error.code !== "ASYNC_OP_IN_PROGRESS") {
        console.log("Google Auth Error:", error.message || error);
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
            source={require("../../../assests/google.png")}
            style={styles.icon}
            transition={300}
            contentFit="contain"
            cachePolicy={"memory-disk"}
          />
        </View>
        <View style={styles.labelWrap}>
          <Text style={styles.buttonLabel}>
            Sign-in with Google
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
    borderColor: Colors.muted,
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
    color: Colors.textDark,
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
    color: Colors.primary,
  }
});
