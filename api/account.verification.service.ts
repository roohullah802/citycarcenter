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
    const response = await axiosInstance.post("/issues", data);
    return response.data;
  },
  signature: async () => {
    const response = await axiosInstance.get("/signature");
    return response;
  },
};

export default accountVerificationApi;
