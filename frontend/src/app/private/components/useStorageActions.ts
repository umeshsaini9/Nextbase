"use client";
import { useState } from "react";
import JSZip from "jszip";
import { supabase } from "@/utils/supabase/client";
import { uploadFile, downloadFile, listFiles } from "@/utils/supabase/storage";
import type { FileObject } from "@supabase/storage-js";

export function useStorageActions(user: any, refreshFiles: (path: string) => void) {
  const [isBusy, setIsBusy] = useState(false);
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

  // Upload a single file
  const upload = async (file: File, currentFolder: string) => {
    if (!user || !file) return;
    setIsBusy(true);
    try {
      const path = `${user.id}/${currentFolder}${file.name}`;
      await uploadFile(file, "uploads", path);
      refreshFiles(currentFolder);
    } catch (e) {
      console.error("Upload error:", e);
    } finally {
      setIsBusy(false);
    }
  };

  // Create new folder
  const createFolder = async (name: string, currentFolder: string) => {
    if (!user || !name.trim()) return;
    const folderPath = `${user.id}/${currentFolder}${name}/.keep`;
    const blob = new Blob([], { type: "text/plain" });
    await uploadFile(blob as any, "uploads", folderPath);
    refreshFiles(currentFolder);
  };

  // Delete single file
  const deleteFile = async (name: string, currentFolder: string) => {
    if (!user) return;
    if (!confirm(`Delete ${name}?`)) return;
    const path = `${user.id}/${currentFolder}${name}`;
    await supabase.storage.from("uploads").remove([path]);
    refreshFiles(currentFolder);
  };

  // Recursive folder delete
  const deleteFolderRecursive = async (folder: string, currentFolder: string) => {
    if (!user) return;
    if (!confirm(`Delete folder '${folder}' and all its contents?`)) return;
    setIsBusy(true);

    const prefix = `${user.id}/${currentFolder}${folder}/`;
    const recurse = async (p: string) => {
      const list = await listFiles("uploads", p);
      if (!list) return;
      for (const i of list) {
        if (i.metadata === null) await recurse(`${p}${i.name}/`);
        else await supabase.storage.from("uploads").remove([`${p}${i.name}`]);
      }
      await supabase.storage.from("uploads").remove([`${p}.keep`]);
    };

    await recurse(prefix);
    refreshFiles(currentFolder);
    setIsBusy(false);
  };

  // Recursive folder rename
  const renameFolder = async (oldName: string, newName: string, currentFolder: string) => {
    if (!user || !newName.trim()) return;
    const oldP = `${user.id}/${currentFolder}${oldName}/`;
    const newP = `${user.id}/${currentFolder}${newName}/`;
    setIsBusy(true);

    const moveRecursive = async (from: string, to: string) => {
      const list = await listFiles("uploads", from);
      if (!list) return;
      for (const item of list) {
        if (item.metadata === null) {
          await moveRecursive(`${from}${item.name}/`, `${to}${item.name}/`);
        } else {
          await supabase.storage.from("uploads").move(`${from}${item.name}`, `${to}${item.name}`);
        }
      }
    };
    await moveRecursive(oldP, newP);
    await supabase.storage.from("uploads").remove([`${oldP}.keep`]);
    refreshFiles(currentFolder);
    setIsBusy(false);
  };

  // Recursive folder download
  const downloadFolderRecursive = async (folder: string, currentFolder: string) => {
    if (!user) return;
    setIsBusy(true);
    const zip = new JSZip();
    const base = `${user.id}/${currentFolder}${folder}`;

    const collect = async (prefix: string, zipFolder: JSZip) => {
      const list = await listFiles("uploads", prefix);
      if (!list) return;
      for (const item of list) {
        const path = `${prefix}${item.name}`;
        if (item.metadata === null) {
          const sub = zipFolder.folder(item.name)!;
          await collect(`${path}/`, sub);
        } else {
          const { data } = await downloadFile("uploads", path);
          if (data) zipFolder.file(item.name, data);
        }
      }
    };
    await collect(`${base}/`, zip);
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${folder || "root"}.zip`;
    a.click();
    URL.revokeObjectURL(url);
    setIsBusy(false);
  };

  return {
    isBusy,
    downloadingFile,
    setDownloadingFile,
    upload,
    createFolder,
    deleteFile,
    deleteFolderRecursive,
    renameFolder,
    downloadFolderRecursive,
  };
}
