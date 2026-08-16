import { useSSO } from "@clerk/expo";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
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
  const { startSSOFlow } = useSSO();

  const handlePress = async () => {
    try {
      const redirectUrl = Linking.createURL("/?oauth=true", { scheme: "citycarcenter" });
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: "oauth_apple",
          redirectUrl,
        });
      const sessionId =
        createdSessionId ||
        signIn?.createdSessionId ||
        signUp?.createdSessionId;

      if (sessionId && setActive) {
        await setActive({ session: sessionId });
        router.replace("/(tabs)/Home");
        return;
      }
      if (signUp && signUp.status === "missing_requirements") {
        const transfer = await signUp.prepareVerification({
          strategy: "oauth_apple",
          redirectUrl,
        });

        if (transfer.createdSessionId && setActive) {
          await setActive({ session: transfer.createdSessionId });
          router.replace("/(tabs)/Home");
        }
      }
    } catch (error: any) {
      console.log("Auth Error:", error.errors?.[0]?.longMessage || "Failed");
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
          <ActivityIndicator size="large" color={"rgba(31, 48, 94, 0.88)"} />
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
