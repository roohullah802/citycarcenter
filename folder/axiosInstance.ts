import { showToast } from "@/folder/toastService";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL!,
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

// ─── Rate-limit guard ────────────────────────────────────────────────────────
// When the server returns 429 (Too Many Requests) we show a toast and
// silently cancel the rejection so React Query / callers never see an error
// and the app keeps running normally.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 429) {
      showToast(error.response.data?.message ?? "Too many requests. Please wait a moment.");
      // Return a resolved promise with null data so the call is "swallowed"
      return Promise.resolve({ data: null, status: 429, rateLimited: true });
    }
    return Promise.reject(error);
  }
);
