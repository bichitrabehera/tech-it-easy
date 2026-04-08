import ImageKit from "imagekit";

if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
  // We throw error in prod, but let the dev know in dev
  if (process.env.NODE_ENV === "production") {
    throw new Error("Missing ImageKit environment variables");
  } else {
    console.warn("ImageKit environment variables are missing. Uploads will fail.");
  }
}

export const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "missing",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "missing",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "missing",
});
