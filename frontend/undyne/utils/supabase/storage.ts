// utils/supabase/storage.ts
import { supabase } from "@/utils/supabase/client";

/**
 * Uploads a file to the specified Supabase storage bucket and path.
 */
export async function uploadFile(
  file: File,
  bucketName: string,
  path: string
) {
  const { data, error } = await supabase.storage.from(bucketName).upload(path, file);
  if (error) {
    console.error("Supabase upload error:", error.message, error);
    throw error;
  }
  return data;
}

/**
 * Downloads a file from Supabase storage and returns a Blob.
 */
export async function downloadFile(
  bucketName: string,
  path: string
): Promise<{ data: Blob | null; error: Error | null }> {
  const { data, error } = await supabase.storage.from(bucketName).download(path);
  return { data, error };
}

/**
 * Lists files from a bucket (optionally within a folder).
 */
export async function listFiles(
  bucketName: string,
  folderPath: string = ""
) {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .list(folderPath, { limit: 100, offset: 0 });

  if (error) throw error;
  return data;
}

export async function deleteFile(bucketName: string, path: string) {
  const { error } = await supabase.storage.from(bucketName).remove([path]);
  if (error) throw error;
  return true;
}