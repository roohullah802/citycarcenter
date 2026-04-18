import { axiosInstance } from "@/folder/axiosInstance";

const contentApi = {
  faqs: async () => {
    const response = await axiosInstance.get("/faqs");
    return response.data;
  },
  policy: async () => {
    const response = await axiosInstance.get("/policies");
    return response.data;
  },
};

export default contentApi;
