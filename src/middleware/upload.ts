import { Storage } from "@google-cloud/storage";
import { v4 as uuidv4 } from "uuid";
import path from "path";
// 🔹 Google Cloud Storage Configuration
const storage = new Storage({
  keyFilename: path.join(process.cwd(), "config/ieh_bucket.json"), // Ensure this file is in .gitignore
});
const bucketName = "ieh_bucket"; // Change this to your actual bucket name


// 🔹 Utility function to upload file to GCS
export const uploadFileToGCS = async (file: File, folder: string) => {
  const fileExtension = path.extname(file.name);
  const fileName = `${folder}/${uuidv4()}${fileExtension}`; // Generate unique filename
  const bucket = storage.bucket(bucketName);
  const blob = bucket.file(fileName);
  const buffer = Buffer.from(await file.arrayBuffer());

  await blob.save(buffer, {
    contentType: file.type,
    metadata: { cacheControl: "public, max-age=31536000" },
  });

  return `https://storage.googleapis.com/${bucketName}/${fileName}`; // Public URL
};
