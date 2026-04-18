import { axiosInstance } from "@/folder/axiosInstance";

const accountVerificationApi = {
  documents: async (data: any) => {
    const response = await axiosInstance.post("/documents", data);
    return response.data;
  },
  documentStatus: async () => {
    const response = await axiosInstance.get("/documents/status");
    return response.data;
  },
  issues: async (data: any) => {
    console.log(process.env.EXPO_PUBLIC_BASE_URL);
    const response = await axiosInstance.post("/issues", data);
    console.log(response.status);
    return response.data;
  },
};

export default accountVerificationApi;
