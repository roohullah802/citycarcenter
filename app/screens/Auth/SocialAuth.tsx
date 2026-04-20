import React, { useCallback, useRef } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import { Modalize } from "react-native-modalize";
import { SafeAreaView } from "react-native-safe-area-context";
import SignInWithApple from "./SignInWithApple";
import SignInWithGoogle from "./SignInWithGoogle";
import { Ionicons } from "@expo/vector-icons";

export default function SocialAuthScreen() {
  const modelRef = useRef<Modalize>(null);

  const openModel = useCallback(() => modelRef.current?.open(), []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.decorativeCircle} />

      <View style={styles.main}>
        <View style={styles.header}>
          <View style={styles.brandMark}>
            <Ionicons name="car-sport" size={24} color="#FFF" />
          </View>
          <Text style={styles.heroText}>
            Elevate Your{"\n"}
            <Text style={styles.heroBold}>Driving Experience</Text>
          </Text>
          <Text style={styles.brandSub}>CITY CAR CENTER — PREMIUM FLEET</Text>
        </View>

        <View style={styles.authWrapper}>
          <Text style={styles.authTitle}>Secure Access</Text>
          <Text style={styles.authDescription}>
            Sign in to access your curated fleet and seamless booking
            management.
          </Text>

          <View style={styles.buttonContainer}>
            <SignInWithGoogle />
            <SignInWithApple />
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={openModel}
            style={styles.whyButton}
            activeOpacity={0.6}
          >
            <Text style={styles.whyText}>Security & Privacy Information</Text>
            <Ionicons name="chevron-forward" size={14} color="#94A3B8" />
          </TouchableOpacity>

          <Text style={styles.copyright}>© 2026 CITY CAR CENTER</Text>
        </View>
      </View>

      <Modalize
        ref={modelRef}
        adjustToContentHeight
        handlePosition="inside"
        modalStyle={styles.modal}
        handleStyle={{ backgroundColor: "#E2E8F0", width: 40 }}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalIcon}>
            <Ionicons name="shield-checkmark" size={32} color="#73C2FB" />
          </View>

          <Text style={styles.modalHeading}>Enterprise-Grade Security</Text>

          <Text style={styles.modalBody}>
            We use encrypted authentication to ensure your personal data, rental
            preferences, and payment details remain confidential and accessible
            only to you.
          </Text>

          <View style={styles.swipeHint}>
            <Text style={styles.swipeHintText}>Swipe down to dismiss</Text>
          </View>
        </View>
      </Modalize>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  decorativeCircle: {
    position: "absolute",
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#F8FAFC",
    zIndex: -1,
  },
  main: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: "space-between",
  },
  header: {
    marginTop: 40,
  },
  brandMark: {
    width: 48,
    height: 48,
    backgroundColor: "#1F305E",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#1F305E",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  heroText: {
    fontSize: 30,
    fontWeight: "300",
    color: "#1F305E",
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  heroBold: {
    fontWeight: "800",
  },
  brandSub: {
    fontSize: 10,
    fontWeight: "800",
    color: "#73C2FB",
    letterSpacing: 2,
    marginTop: 12,
  },
  authWrapper: {
    marginTop: 20,
  },
  authTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F305E",
    marginBottom: 8,
  },
  authDescription: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
    marginBottom: 32,
    fontWeight: "500",
  },
  buttonContainer: {
    gap: 14,
  },
  footer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  whyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
  },
  whyText: {
    color: "#94A3B8",
    fontWeight: "700",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  copyright: {
    fontSize: 9,
    color: "#CBD5E1",
    fontWeight: "800",
    marginTop: 8,
  },

  modal: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: "#FFFFFF",
  },
  modalContent: {
    padding: 32,
    paddingTop: 45,
    alignItems: "center",
    paddingBottom: 60,
  },
  modalIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: "#F0F9FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  modalHeading: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1F305E",
    marginBottom: 12,
  },
  modalBody: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "500",
  },
  swipeHint: {
    marginTop: 40,
    opacity: 0.5,
  },
  swipeHintText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
