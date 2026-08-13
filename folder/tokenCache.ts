import AsyncStorage from "@react-native-async-storage/async-storage";

export const tokenCache = {
  async getToken(key: string) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (err: any) {
      await AsyncStorage.removeItem(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (err: any) {
      return;
    }
  },
  async clearToken(key: string) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (err: any) {
      return;
    }
  },
};
