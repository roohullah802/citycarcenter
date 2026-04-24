import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/utils/Colors";

type ToastType = "success" | "error" | "info";

let showToastFn: ((message: string, type?: ToastType) => void) | null = null;

export const showToast = (message: string, type: ToastType = "info") => {
  if (showToastFn) {
    showToastFn(message, type);
  } else {
    console.warn("⚠️ ToastProvider not mounted yet.");
  }
};

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const [message, setMessage] = useState("");
  const [type, setType] = useState<ToastType>("info");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    showToastFn = (msg: string, t: ToastType = "info") => {
      setMessage(msg);
      setType(t);
      setVisible(true);

      // Reset animations
      fadeAnim.setValue(0);
      slideAnim.setValue(-100);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5)),
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5)),
        }),
      ]).start();

      setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setVisible(false);
        });
      }, 3000);
    };

    return () => {
      showToastFn = null;
    };
  }, [fadeAnim, slideAnim]);

  const getIcon = () => {
    switch (type) {
      case "success": return "checkmark-circle";
      case "error": return "alert-circle";
      default: return "information-circle";
    }
  };

  const getIconColor = () => {
    switch (type) {
      case "success": return Colors.success;
      case "error": return Colors.danger;
      default: return Colors.info;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {children}

      {visible && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.toastContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.toast}>
            <View style={[styles.iconContainer, { backgroundColor: `${getIconColor()}15` }]}>
              <Ionicons name={getIcon()} size={20} color={getIconColor()} />
            </View>
            <Text style={styles.text} numberOfLines={2}>
              {message}
            </Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

export default ToastProvider;

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    left: 20,
    right: 20,
    alignItems: "center",
    zIndex: 9999,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 18,
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.border,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.12,
        shadowRadius: 15,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  text: {
    flex: 1,
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
});
