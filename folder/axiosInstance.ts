import { showToast } from "@/folder/toastService";
import { getClerkInstance } from "@clerk/expo"; // Import Clerk directly
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL!,
});

// REQUEST INTERCEPTOR: Dynamically fetches a fresh token for every request
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Clerk automatically manages refreshing the token if it is expired
      const clerk = getClerkInstance();
      const token = await clerk.session?.getToken();

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Failed to get Clerk token for API request:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR: Handles errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 429) {
      showToast(error.response.data?.message ?? "Too many requests. Please wait a moment.");
      return Promise.resolve({ data: null, status: 429, rateLimited: true });
    }
    return Promise.reject(error);
  }
);
