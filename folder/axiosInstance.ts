import { showToast } from "@/folder/toastService";
import { getClerkInstance } from "@clerk/expo"; // Import Clerk directly
import axios from "axios";

const rawBaseUrl = process.env.EXPO_PUBLIC_BASE_URL || "https://api.citycarcenters.com/api/v1/users";
const baseURL = rawBaseUrl.replace(/\/+$/, "");

export const axiosInstance = axios.create({
  baseURL,
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
      // Token fetch failed (likely due to an invalid/expired session).
      // We silently catch this here. The request will proceed without a token,
      // the backend will return 401, and our response interceptor will cleanly sign the user out.
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR: Handles API errors globally with user-friendly messages
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "An unexpected error occurred. Please try again.";

    if (error?.response) {
      const status = error.response.status;
      const backendMsg = error.response.data?.message;
      const clerkAuthStatus = error.response.headers?.["x-clerk-auth-status"];

      // Do not show toast messages to the user for 429 rate limit responses
      if (status === 429) {
        return Promise.reject(error);
      }

      // If the backend returns 404 but it's actually a Clerk auth error, treat it as 401
      if (clerkAuthStatus === "signed-out" || status === 401) {
        message = "Session expired or unauthorized. Please log in again.";
        // Automatically sign out the user to clear the broken session
        const clerk = getClerkInstance();
        if (clerk.session) {
          // Force clear local session first, then attempt network signout
          clerk.setActive({ session: null }).catch(() => {});
          clerk.signOut().catch(() => {});
        }
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

