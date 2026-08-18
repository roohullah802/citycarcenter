import { axiosInstance } from "@/folder/axiosInstance";

const favouriteApi = {
  getFavourites: async (userId: string) => {
    const response = await axiosInstance.get(`/favourites`);
    return response.data;
  },
  toggleFavourite: async (data: { carId: string }, userId: string) => {
    const response = await axiosInstance.post(`/favourites`, data);
    return response.data;
  },
};

export default favouriteApi;
