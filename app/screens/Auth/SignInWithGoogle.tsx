import { useSSO } from "@clerk/expo";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignInWithGoogle() {
  const { startSSOFlow } = useSSO();
  const [loading, setLoading] = useState<boolean>(false);

  const handlePress = async () => {
    setLoading(true);
    try {
      const redirectUrl = Linking.createURL("/", {
        scheme: "citycarcenter",
      });
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: "oauth_google",
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
          strategy: "oauth_google",
          redirectUrl,
        });

        if (transfer.createdSessionId && setActive) {
          await setActive({ session: transfer.createdSessionId });
        }
      }
    } catch (error: any) {
      console.log("Auth Error:", error.errors?.[0]?.longMessage || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      style={[styles.button, { height: 56 }]}
    >
      <View style={styles.iconWrap}>
        <Image
          source={require("../../../assests/google.png")}
          style={styles.icon}
          resizeMode="contain"
        />
      </View>
      <View style={styles.labelWrap}>
        <Text style={styles.buttonLabel}>
          {loading ? (
            <ActivityIndicator
              style={{ justifyContent: "center", alignItems: "center" }}
              size={"small"}
              color={"#73C2FB"}
            />
          ) : (
            "Sign-in with Google"
          )}
        </Text>
      </View>
    </TouchableOpacity>
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
});
