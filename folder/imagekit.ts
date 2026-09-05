import ImageKit from "imagekit-javascript";

let imagekit: ImageKit | null = null;

export const getImageKit = () => {
  const publicKey = process.env.EXPO_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  const urlEndpoint = process.env.EXPO_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !urlEndpoint) {
    throw new Error(
      "ImageKit is not configured. Set EXPO_PUBLIC_IMAGEKIT_PUBLIC_KEY and EXPO_PUBLIC_IMAGEKIT_URL_ENDPOINT, then restart Expo.",
    );
  }

  if (!imagekit) {
    imagekit = new ImageKit({ publicKey, urlEndpoint });
  }

  return imagekit;
};
