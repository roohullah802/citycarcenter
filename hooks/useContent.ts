import contentApi from "@/api/content.service";
import { useQuery } from "@tanstack/react-query";

export const useFaqs = () => {
  const result = useQuery({
    queryKey: ["faqs"],
    queryFn: contentApi.faqs,
  });
  return result;
};

export const usePolicy = () => {
  const result = useQuery({
    queryKey: ["policy"],
    queryFn: contentApi.policy,
  });
  return result;
};
