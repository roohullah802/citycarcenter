import { axiosInstance } from "@/folder/axiosInstance";

const favouriteApi = {
  getFavourites: async (userId: string) => {
    const response = await axiosInstance.get(`/favourites/${userId}`);
    return response.data;
  },
  toggleFavourite: async (data: { userId: string; carId: string }) => {
    const response = await axiosInstance.post("/favourites", data);
    return response.data;
  },
};

export default favouriteApi;
