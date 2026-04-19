import { axiosInstance } from "./axiosInstance";
import { imagekit } from "./imagekit";

export const uploadFile = async (uri: string, fileName: string) => {
  try {
    const response = await axiosInstance.get("/signature");
    const auth = response.data?.imagekit_signature;

    if (!auth || !auth.signature || !auth.token || !auth.expire) {
      throw new Error(
        "Failed to obtain a valid upload signature from the server.",
      );
    }
    const result = await imagekit.upload({
      file: uri,
      fileName: fileName,
      signature: auth.signature,
      expire: auth.expire,
      token: auth.token,
    });
    return result;
  } catch (error: any) {
    throw error;
  }
};
