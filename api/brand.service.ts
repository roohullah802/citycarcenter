import { axiosInstance } from "@/folder/axiosInstance";

const brandApi = {
  brands: async () => {
    const response = await axiosInstance.get("/brands");
    return response.data;
  },
};

export default brandApi;
