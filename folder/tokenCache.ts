import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const secureStoreOptions =
  Platform.OS === "android"
    ? { keychainAccessible: SecureStore.WHEN_UNLOCKED }
    : { keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK };

const isEmptyToken = (value: string | null) =>
  value == null || value === "null" || value === "undefined";

async function readSecureToken(key: string) {
  try {
    return await SecureStore.getItemAsync(key, secureStoreOptions);
  } catch (error) {
    console.warn("[TokenCache] SecureStore read failed:", error);
    return null;
  }
}

async function readAsyncToken(key: string) {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.warn("[TokenCache] AsyncStorage read failed:", error);
    return null;
  }
}

export const tokenCache = {
  async getToken(key: string) {
    const secureToken = await readSecureToken(key);
    if (!isEmptyToken(secureToken)) {
      return secureToken;
    }

    const asyncToken = await readAsyncToken(key);
    if (!isEmptyToken(asyncToken)) {
      return asyncToken;
    }

    return null;
  },

  async saveToken(key: string, value: string) {
    try {
      await Promise.allSettled([
        SecureStore.setItemAsync(key, value, secureStoreOptions),
        AsyncStorage.setItem(key, value),
      ]);
    } catch (error) {
      console.warn("[TokenCache] saveToken failed in both stores:", error);
      try {
        await AsyncStorage.setItem(key, value);
      } catch {}
    }
  },

  async clearToken(key: string) {
    await Promise.allSettled([
      SecureStore.deleteItemAsync(key, secureStoreOptions),
      AsyncStorage.removeItem(key),
    ]);
  },
};
