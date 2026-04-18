import carsApi from "@/api/cars.service";
import { useQuery } from "@tanstack/react-query";

export const useCars = () => {
  const result = useQuery({
    queryKey: ["cars"],
    queryFn: carsApi.cars,
  });

  return result;
};

export const useCarById = (id: string) => {
  const result = useQuery({
    queryKey: ["carsById", id],
    queryFn: () => carsApi.carById(id),
    enabled: !!id,
    refetchInterval: 5000,
  });

  return result;
};
