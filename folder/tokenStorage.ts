import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'city_car_center_jwt_token';
const USER_KEY = 'city_car_center_user';

export const tokenStorage = {
  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Failed to get token:', error);
      return null;
    }
  },

  async setToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error('Failed to set token:', error);
    }
  },

  async removeToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Failed to remove token:', error);
    }
  },

  async getUser(): Promise<Record<string, any> | null> {
    try {
      const userJson = await SecureStore.getItemAsync(USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Failed to get user:', error);
      return null;
    }
  },

  async setUser(user: Record<string, any>): Promise<void> {
    try {
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to set user:', error);
    }
  },

  async removeUser(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch (error) {
      console.error('Failed to remove user:', error);
    }
  },

  async clear(): Promise<void> {
    try {
      await this.removeToken();
      await this.removeUser();
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  },
};
