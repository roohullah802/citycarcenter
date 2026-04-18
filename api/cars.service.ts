import { axiosInstance } from "@/folder/axiosInstance";

const carsApi = {
  cars: async () => {
    const response = await axiosInstance.get("/cars");
    return response.data;
  },
  carById: async (id: string) => {
    const response = await axiosInstance.get(`/cars/${id}`);
    return response.data;
  },
};

export default carsApi;
