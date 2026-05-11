import { axiosInstance } from "@/folder/axiosInstance";

const favouriteApi = {
  getFavourites: async (userId: string) => {
    const response = await axiosInstance.get(`/favourites/${userId}`);
    return response.data;
  },
  toggleFavourite: async (data: { carId: string }, userId: string) => {
    const response = await axiosInstance.post(`/favourites/${userId}`, data);
    return response.data;
  },
};

export default favouriteApi;
