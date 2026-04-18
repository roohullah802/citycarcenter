import accountVerificationApi from "@/api/account.verification.service";
import { showToast } from "@/folder/toastService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router } from "expo-router";

export const useUploadDocs = (data: any) => {
  const result = useMutation({
    mutationKey: ["uploadDocs"],
    mutationFn: () => accountVerificationApi.documents(data),
    onSuccess: () => showToast("Documents uploaded successfully! "),
    onError: (error) =>
      showToast(error.message || "Failed to upload documents!"),
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
    onError: (error) => {
      console.log(error);
      showToast(error.message || "Failed to post issue!");
    },
  });
  return result;
};
