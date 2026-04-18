import paymentApi from "@/api/payment.service";
import { showToast } from "@/folder/toastService";
import { useMutation, useQuery } from "@tanstack/react-query";

export const usePaymentHistory = () => {
  const result = useQuery({
    queryKey: ["payment"],
    queryFn: paymentApi.paymentHistory,
  });
  return result;
};

export const useCreateIntent = () => {
  const result = useMutation({
    mutationKey: ["intent"],
    mutationFn: (data: any) => paymentApi.createIntent(data),
    onSuccess: () => showToast("Intent created! "),
    onError: (error) => {
      showToast(error.message || "Failed to create intent");
    },
  });

  return result;
};
