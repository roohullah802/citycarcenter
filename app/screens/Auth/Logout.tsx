import { useAuth } from "@clerk/expo";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";
import { showToast } from "../../../folder/toastService";

const { width } = Dimensions.get("window");

interface LogoutModalProps {
  visible: boolean;
  onClose: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ visible, onClose }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { signOut } = useAuth();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut();
      onClose(); // Close modal before navigating
      router.replace("/screens/Auth/SocialAuth"); // Replace prevents going 'back' to settings
    } catch (error: any) {
      showToast(error?.message || "Logout failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType="fade" // Fade is often smoother for professional alerts
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          {/* Danger Icon */}
          <View style={styles.iconWrapper}>
            <Icon name="log-out-outline" size={RFValue(28)} color="#EF4444" />
          </View>

          {/* Text Content */}
          <Text style={styles.title}>Sign Out</Text>
          <Text style={styles.subtitle}>
            Are you sure you want to log out? You will need your credentials to
            sign back in.
          </Text>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={loading}
              style={styles.logoutBtn}
              onPress={handleLogout}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.logoutText}>Log Out</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Darker for better focus
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.1,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 20, // More rounded for modern look
    padding: RFValue(24),
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  iconWrapper: {
    backgroundColor: "#FEF2F2", // Very light red
    borderRadius: 50,
    padding: RFValue(16),
    marginBottom: RFValue(16),
  },
  title: {
    fontSize: RFValue(18),
    color: "#111827",
    marginBottom: RFValue(8),
    fontFamily: "bold",
  },
  subtitle: {
    fontSize: RFValue(13),
    color: "#6B7280",
    textAlign: "center",
    marginBottom: RFValue(24),
    fontFamily: "medium",
    lineHeight: RFValue(18),
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: RFValue(12),
    borderRadius: 12,
    backgroundColor: "#F3F4F6", // Neutral light grey
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    color: "#4B5563",
    fontSize: RFValue(14),
    fontFamily: "bold",
  },
  logoutBtn: {
    flex: 1,
    paddingVertical: RFValue(12),
    borderRadius: 12,
    backgroundColor: "#EF4444", // Professional red
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: RFValue(14),
    fontFamily: "bold",
  },
});

export default LogoutModal;
