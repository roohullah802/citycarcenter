import ImageKit from "imagekit-javascript";

export const imagekit = new ImageKit({
  publicKey: process.env.EXPO_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: process.env.EXPO_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});
