import { axiosInstance } from "./axiosInstance";

export const uploadFile = async (uri: string, fileName: string) => {
  try {
    const { data } = await axiosInstance.get("/signature");
    const { signature, token, expire } = data;

    const formData = new FormData();

    formData.append("file", {
      uri: uri,
      name: fileName,
      type: "image/jpeg",
    } as any);

    formData.append("publicKey", process.env.IMAGEKIT_PUBLIC_KEY!);
    formData.append("signature", signature);
    formData.append("expire", expire);
    formData.append("token", token);
    formData.append("fileName", fileName);

    const response = await fetch(
      "https://upload.imagekit.io/api/v1/files/upload",
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Direct Upload Error:", error);
    throw error;
  }
};
