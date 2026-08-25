import { useEffect, useRef } from "react";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import { showToast } from "@/folder/toastService";

/**
 * Monitors network connectivity and shows toast messages when:
 * - The device goes offline
 * - The connection comes back online
 *
 * Skips the initial check to avoid showing a toast on app launch
 * when the user is already offline (only reacts to *changes*).
 */
export function useNetworkMonitor() {
  const isFirstCheck = useRef(true);
  const wasConnected = useRef(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const isConnected = state.isConnected ?? true;

      // Skip the very first event so we don't toast on app launch
      if (isFirstCheck.current) {
        isFirstCheck.current = false;
        wasConnected.current = isConnected;
        return;
      }

      // Connection lost
      if (wasConnected.current && !isConnected) {
        showToast("No internet connection. Please check your network.", "error");
      }

      // Connection restored
      if (!wasConnected.current && isConnected) {
        showToast("You're back online!", "success");
      }

      wasConnected.current = isConnected;
    });

    return () => unsubscribe();
  }, []);
}
