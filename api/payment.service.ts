import { axiosInstance } from "@/folder/axiosInstance";

const paymentApi = {
  paymentHistory: async () => {
    const response = await axiosInstance.get("/payments/history");
    return response.data;
  },

  createIntent: async (data: any) => {
    const response = await axiosInstance.post("/payments/create-intent", data) as any;
    if (response?.rateLimited) return { rateLimited: true };
    return response.data;
  },
};

export default paymentApi;
