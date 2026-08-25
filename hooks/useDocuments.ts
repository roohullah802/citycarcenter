import accountVerificationApi from "@/api/account.verification.service";
import { showToast } from "@/folder/toastService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";

export const useUploadDocs = () => {
  const queryClient = useQueryClient();

  const result = useMutation({
    mutationKey: ["uploadDocs"],
    mutationFn: (data: any) => accountVerificationApi.documents(data),
    onSuccess: () => {
      showToast("Documents uploaded successfully! ");
      // Invalidate the status query to immediately fetch the new pending status
      queryClient.invalidateQueries({ queryKey: ["status"] });
    },
  });

  return result;
};

export const useDocumentStatus = () => {
  const result = useQuery({
    queryKey: ["status"],
    queryFn: accountVerificationApi.documentStatus,
  });
  return result;
};

export const usePostIssues = () => {
  const result = useMutation({
    mutationKey: ["issues"],
    mutationFn: (data: any) => accountVerificationApi.issues(data),
    onSuccess: () => {
      showToast("Issue post successfully");
      router.back();
    },
  });
  return result;
};

export const useSignature = () => {
  const result = useQuery({
    queryKey: ["signature"],
    queryFn: accountVerificationApi.signature,
  });
  return result;
};
