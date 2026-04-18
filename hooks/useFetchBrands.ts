import brandApi from "@/api/brand.service";
import { useQuery } from "@tanstack/react-query";

export const useFetchBrands = () => {
  const result = useQuery({
    queryKey: ["brands"],
    queryFn: brandApi.brands,
  });
  return result;
};
