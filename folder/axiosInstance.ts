import { showToast } from "@/folder/toastService";
import { tokenStorage } from "@/folder/tokenStorage";
import axios from "axios";

const rawBaseUrl = process.env.EXPO_PUBLIC_BASE_URL || "https://api.citycarcenters.com/api/v1/users";
const baseURL = rawBaseUrl.replace(/\/+$/, "");

export const axiosInstance = axios.create({
  baseURL,
});

// REQUEST INTERCEPTOR: Dynamically fetches JWT token for every request
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await tokenStorage.getToken();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Failed to get token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR: Handles API errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    let message = "An unexpected error occurred. Please try again.";

    if (error?.response) {
      const status = error.response.status;
      const backendMsg = error.response.data?.message;

      // Do not show toast for 429 rate limit
      if (status === 429) {
        return Promise.reject(error);
      }

      // Unauthorized - token expired or invalid
      if (status === 401) {
        message = "Session expired. Please log in again.";
        await tokenStorage.clear();
      } else if (backendMsg && typeof backendMsg === "string") {
        message = backendMsg;
      } else if (status === 400) {
        message = "Invalid input provided. Please verify your details.";
      } else if (status === 403) {
        message = "Access denied. You do not have permission for this action.";
      } else if (status === 404) {
        message = "The requested information could not be found.";
      } else if (status >= 500) {
        message = "Server error encountered. Please try again later.";
      }
    } else if (error?.request) {
      message = "Network error. Please check your internet connection.";
    }

    showToast(message);
    return Promise.reject(error);
  }
);

