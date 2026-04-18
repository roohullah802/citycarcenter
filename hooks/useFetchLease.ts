import leaseApi from "@/api/lease.service";
import { showToast } from "@/folder/toastService";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useLeases = () => {
  const result = useQuery({
    queryKey: ["leases"],
    queryFn: leaseApi.leases,
  });

  return result;
};

export const useLeaseById = (id: string) => {
  const result = useQuery({
    queryKey: ["leaseById"],
    queryFn: () => leaseApi.leaseById(id),
    enabled: !!id,
    refetchInterval: 10000,
  });

  return result;
};

export const useActiveLeases = () => {
  const result = useQuery({
    queryKey: ["activeLeases"],
    queryFn: leaseApi.activeLeases,
  });
  return result;
};

export const useLeaseReturn = (id: string) => {
  const result = useMutation({
    mutationKey: ["leaseRetuen"],
    mutationFn: () => leaseApi.returnCar(id),
    onSuccess: () => showToast("Car Return Successfully"),
    onError: (error) => showToast(error.message || "Failed to return car!"),
  });

  return result;
};
