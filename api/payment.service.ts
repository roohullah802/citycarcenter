import { axiosInstance } from "@/folder/axiosInstance";

const paymentApi = {
  paymentHistory: async () => {
    const response = await axiosInstance.get("/payments/history");
    return response.data;
  },

  createIntent: async (data: any) => {
    const response = await axiosInstance.post("/payments/create-intent", data);
    return response.data;
  },
};

export default paymentApi;
