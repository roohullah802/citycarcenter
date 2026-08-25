import { showToast } from "@/folder/toastService";
import { uploadFile } from "@/folder/upload";
import { useAuth } from "@/context/AuthContext";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Alert } from "react-native";
import { useUploadDocs } from "./useDocuments";

export type DocKey = "cnicFront" | "cnicBack" | "drivingLicence" | "extraDocuments";

export interface ImageAsset {
  uri: string;
  base64: string | null;
}

export interface DocState {
  cnicFront: ImageAsset | null;
  cnicBack: ImageAsset | null;
  drivingLicence: ImageAsset | null;
  extraDocuments: ImageAsset[];
}

export interface UploadResult {
  key: DocKey;
  url: string;
  fileId: string;
}

export const useDocumentUploadLogic = () => {
  const { user } = useAuth();
  const { mutateAsync: uploadDocToDB } = useUploadDocs();

  const [isLoading, setIsLoading] = useState(false);
  const [docs, setDocs] = useState<DocState>({
    cnicFront: null,
    cnicBack: null,
    drivingLicence: null,
    extraDocuments: [],
  });

  const canContinue = useMemo(
    () => !!(docs.cnicFront && docs.cnicBack && docs.drivingLicence),
    [docs]
  );

  const handlePickImage = async (key: DocKey) => {
    try {
      const isExtra = key === "extraDocuments";
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert("Permission required", "Gallery access is needed to upload documents.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: !isExtra,
        allowsMultipleSelection: isExtra,
        aspect: [4, 3],
        quality: 0.8,
        base64: true, // Keeping true to match existing behavior, but URI is preferred
      });

      if (result.canceled) return;

      if (isExtra) {
        const newDocs = result.assets.map((asset) => ({
          uri: asset.uri,
          base64: asset.base64 || null,
        }));
        setDocs((prev) => ({
          ...prev,
          extraDocuments: [...prev.extraDocuments, ...newDocs],
        }));
      } else {
        const asset = result.assets[0];
        setDocs((prev) => ({
          ...prev,
          [key]: { uri: asset.uri, base64: asset.base64 || null },
        }));
      }
    } catch (error) {
      console.error("Error picking image:", error);
      showToast("An error occurred while picking the image.");
    }
  };

  const handleRemoveImage = (key: DocKey, index?: number) => {
    if (key === "extraDocuments" && typeof index === "number") {
      setDocs((prev) => ({
        ...prev,
        extraDocuments: prev.extraDocuments.filter((_, i) => i !== index),
      }));
    } else {
      setDocs((prev) => ({ ...prev, [key]: null }));
    }
  };

  const uploadSingleFile = async (asset: ImageAsset, key: string, identifier: string): Promise<UploadResult> => {
    try {
      const fileName = `${key}_${user?._id}_${identifier}_${Date.now()}.jpg`;
      const fileToUpload = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
      const result = await uploadFile(fileToUpload, fileName);

      if (!result?.url || !result?.fileId) {
        throw new Error(`Invalid response from server for ${key}`);
      }

      return {
        key: key as DocKey,
        url: result.url,
        fileId: result.fileId,
      };
    } catch (error) {
      console.error(`Failed to upload ${key}:`, error);
      throw new Error(`Failed to upload ${key}`);
    }
  };

  const handleSubmit = async () => {
    if (!user?._id) {
      showToast("User session not found. Please log in again.");
      return;
    }

    setIsLoading(true);
    try {
      const uploadPromises: Promise<UploadResult>[] = [];

      // 1. Prepare Identity Documents
      const identityKeys: (keyof Omit<DocState, "extraDocuments">)[] = ["cnicFront", "cnicBack", "drivingLicence"];
      identityKeys.forEach((key) => {
        const asset = docs[key];
        if (asset) {
          uploadPromises.push(uploadSingleFile(asset, key, "identity"));
        }
      });

      // 2. Prepare Additional Documents
      docs.extraDocuments.forEach((asset, index) => {
        uploadPromises.push(uploadSingleFile(asset, "extraDocuments", `extra_${index}`));
      });

      if (uploadPromises.length === 0) {
        showToast("No documents to upload.");
        setIsLoading(false);
        return;
      }

      // 3. Execute All Uploads robustly
      const results = await Promise.allSettled(uploadPromises);

      const failedUploads = results.filter((r) => r.status === "rejected");
      if (failedUploads.length > 0) {
        throw new Error(`Failed to upload ${failedUploads.length} document(s). Please try again.`);
      }

      const successfulUploads = results
        .filter((r): r is PromiseFulfilledResult<UploadResult> => r.status === "fulfilled")
        .map((r) => r.value);

      // 4. Construct Final Payload
      const getDocResult = (key: DocKey) => {
        const res = successfulUploads.find((r) => r.key === key);
        return res ? { url: res.url, fileId: res.fileId } : undefined;
      };

      const payload = {
        cnicFront: getDocResult("cnicFront"),
        cnicBack: getDocResult("cnicBack"),
        drivingLicence: getDocResult("drivingLicence"),
        extraDocuments: successfulUploads
          .filter((r) => r.key === "extraDocuments")
          .map((r) => ({ url: r.url, fileId: r.fileId })),
      };

      // 5. Save to DB
      await uploadDocToDB(payload);

      // 6. Clear state after successful submission
      setDocs({
        cnicFront: null,
        cnicBack: null,
        drivingLicence: null,
        extraDocuments: [],
      });

      showToast("Documents submitted successfully!");
      router.push("/screens/Setting/DocumentSubmittedScreen");
    } catch (err: any) {
      console.error("Submission Error Details:", err);
      // Only toast for non-axios errors (e.g. ImageKit upload failures).
      // Axios server errors are already toasted by the interceptor.
      if (!err?.response) {
        showToast(err.message || "Failed to submit documents. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    docs,
    isLoading,
    canContinue,
    handlePickImage,
    handleRemoveImage,
    handleSubmit,
  };
};
