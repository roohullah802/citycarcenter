import { axiosInstance } from "@/folder/axiosInstance";

const leaseApi = {
  leases: async () => {
    const response = await axiosInstance.get("/leases");
    return response.data;
  },
  activeLeases: async () => {
    const response = await axiosInstance.get("/leases/active");
    return response.data;
  },
  leaseById: async (id: string) => {
    const response = await axiosInstance.get(`/lease/${id}`);
    return response.data;
  },
  returnCar: async (id: string) => {
    const response = await axiosInstance.post(`/leases/${id}/return`);
    return response.data;
  },
};

export default leaseApi;
