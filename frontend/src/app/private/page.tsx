"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import JSZip from "jszip";
import { supabase } from "@/utils/supabase/client";
import { uploadFile, downloadFile, listFiles } from "@/utils/supabase/storage";
import type { FileObject } from "@supabase/storage-js";

export default function PrivatePage() {
  const router = useRouter();

  // ---------- AUTH ----------
  const [user, setUser] = useState<any>(null);

  // ---------- UI / STATE ----------
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  const [files, setFiles] = useState<FileObject[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string>(""); // e.g. "projects/"
  const [newFolderName, setNewFolderName] = useState("");
  const [renameTarget, setRenameTarget] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [history, setHistory] = useState<string[]>([""]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // ---------- AUTH CHECK ----------
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }
      setUser(user);
      fetchFiles("");
    };
    getUser();
  }, [router]);

  // ---------- FILE/FOLDER FETCH ----------
  const fetchFiles = async (path: string) => {
    if (!user) return;
    try {
      const prefix = `${user.id}/${path}`;
      const cleanPath =
        prefix.endsWith("/") || prefix === "" ? prefix : `${prefix}/`;
      const data = await listFiles("uploads", cleanPath);
      const filtered = (data || []).filter((f) => f.name !== ".keep");
      setFiles(filtered);
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  // ---------- UPLOAD ----------
  const handleUpload = async () => {
    if (!file || !user) return;
    setIsUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const path = `${user.id}/${currentFolder}${fileName}`;
      await uploadFile(file, "uploads", path);
      setFile(null);
      fetchFiles(currentFolder);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  // ---------- DOWNLOAD SINGLE ----------
  const handleDownload = async (fileName: string) => {
    if (!user) return;
    setDownloadingFile(fileName);
    try {
      const path = `${user.id}/${currentFolder}${fileName}`;
      const { data, error } = await downloadFile("uploads", path);
      if (error || !data) throw error;

      const blobUrl = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download error:", err);
    } finally {
      setDownloadingFile(null);
    }
  };

  // ---------- DOWNLOAD ENTIRE FOLDER ----------
  const downloadFolderRecursive = async (folder: string, zip: JSZip) => {
    const prefix = `${user.id}/${folder}`;
    const list = await listFiles("uploads", prefix);
    if (!list) return;

    for (const item of list) {
      const fullPath = `${prefix}${item.name}`;
      if (item.metadata === null) {
        // folder
        await downloadFolderRecursive(`${folder}${item.name}/`, zip);
      } else {
        const { data } = await downloadFile("uploads", fullPath);
        if (data) zip.file(`${folder}${item.name}`, data);
      }
    }
  };

  const handleDownloadAll = async () => {
    if (!user) return;
    const zip = new JSZip();
    await downloadFolderRecursive(currentFolder, zip);
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (currentFolder || "root").replace(/\/$/, "") + ".zip";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---------- CREATE FOLDER ----------
  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || !user) return;
    try {
      const folderPath = `${user.id}/${currentFolder}${newFolderName}/.keep`;
      const blob = new Blob([], { type: "text/plain" });
      await uploadFile(blob as any, "uploads", folderPath);
      setNewFolderName("");
      fetchFiles(currentFolder);
    } catch (err) {
      console.error("Create folder error:", err);
    }
  };

  // ---------- DELETE ----------
  const handleDelete = async (fileName: string) => {
    if (!user) return;
    if (!confirm(`Delete ${fileName}?`)) return;
    const path = `${user.id}/${currentFolder}${fileName}`;
    const { error } = await supabase.storage.from("uploads").remove([path]);
    if (error) console.error(error);
    fetchFiles(currentFolder);
  };

  // ---------- RENAME ----------
  const handleRename = async (oldName: string, newName: string) => {
    if (!user || !newName.trim()) return;
    const from = `${user.id}/${currentFolder}${oldName}`;
    const to = `${user.id}/${currentFolder}${newName}`;
    const { error } = await supabase.storage.from("uploads").move(from, to);
    if (error) console.error(error);
    setRenameTarget(null);
    fetchFiles(currentFolder);
  };

  // ---------- NAVIGATION ----------
  const enterFolder = (folderName: string) => {
    const newPath = `${currentFolder}${folderName}/`;
    setCurrentFolder(newPath);
    fetchFiles(newPath);
    const newHist = [...history.slice(0, historyIndex + 1), newPath];
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);
  };

  const goUp = () => {
    if (!currentFolder) return;
    const parts = currentFolder.split("/").filter(Boolean);
    parts.pop();
    const parent = parts.length > 0 ? parts.join("/") + "/" : "";
    setCurrentFolder(parent);
    fetchFiles(parent);
    const newHist = [...history.slice(0, historyIndex + 1), parent];
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const idx = historyIndex - 1;
      setHistoryIndex(idx);
      const folder = history[idx];
      setCurrentFolder(folder);
      fetchFiles(folder);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const idx = historyIndex + 1;
      setHistoryIndex(idx);
      const folder = history[idx];
      setCurrentFolder(folder);
      fetchFiles(folder);
    }
  };

  // ---------- UI HELPERS ----------
  const breadcrumbs = currentFolder
    ? currentFolder.split("/").filter(Boolean)
    : [];

  if (!user)
    return (
      <div className="p-6 text-center">
        <p>Checking authentication…</p>
      </div>
    );

  // ---------- RENDER ----------
  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">🔒 Private Files</h1>
          <p className="text-gray-600 text-sm">
            Logged in as <strong>{user.email}</strong>
          </p>
        </div>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/auth");
          }}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* NAVIGATION BAR */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={goBack}
          disabled={historyIndex === 0}
          className="bg-gray-200 text-gray-700 px-2 py-1 rounded disabled:opacity-50"
        >
          ←
        </button>
        <button
          onClick={goForward}
          disabled={historyIndex === history.length - 1}
          className="bg-gray-200 text-gray-700 px-2 py-1 rounded disabled:opacity-50"
        >
          →
        </button>
        <button
          onClick={goUp}
          disabled={!currentFolder}
          className="bg-gray-200 text-gray-700 px-2 py-1 rounded disabled:opacity-50"
        >
          ⬆
        </button>

        {/* Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-1 text-sm text-gray-700">
          <span
            className="cursor-pointer hover:underline"
            onClick={() => {
              setCurrentFolder("");
              fetchFiles("");
              const newHist = [...history, ""];
              setHistory(newHist);
              setHistoryIndex(newHist.length - 1);
            }}
          >
            Root
          </span>
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              <span>/</span>
              <span
                className="cursor-pointer hover:underline"
                onClick={() => {
                  const path = breadcrumbs.slice(0, i + 1).join("/") + "/";
                  setCurrentFolder(path);
                  fetchFiles(path);
                  const newHist = [...history, path];
                  setHistory(newHist);
                  setHistoryIndex(newHist.length - 1);
                }}
              >
                {crumb}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* CREATE FOLDER */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="New folder name"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          className="border rounded px-2 py-1 flex-grow"
        />
        <button
          onClick={handleCreateFolder}
          className="bg-yellow-500 text-white px-3 py-1 rounded"
        >
          Create Folder
        </button>
      </div>

      {/* UPLOAD */}
      <div className="mb-6">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2 disabled:opacity-50"
        >
          {isUploading ? "Uploading…" : "Upload File"}
        </button>
        <button
          onClick={handleDownloadAll}
          className="ml-3 bg-green-600 text-white px-3 py-2 rounded"
        >
          Download Folder
        </button>
      </div>

      {/* FILES & FOLDERS */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentFolder}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          {files.length === 0 ? (
            <p className="text-gray-500">This folder is empty.</p>
          ) : (
            <ul className="space-y-2">
              {files.map((f) =>
                f.metadata === null ? (
                  // FOLDER
                  <li
                    key={f.id || f.name}
                    className="flex justify-between items-center border p-2 rounded hover:bg-gray-50 cursor-pointer"
                  >
                    <span onClick={() => enterFolder(f.name)}>📁 {f.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setRenameTarget(f.name)}
                        className="bg-yellow-400 text-white px-2 py-1 rounded text-sm"
                      >
                        Rename
                      </button>
                      <button
                        onClick={() => handleDelete(f.name + "/.keep")}
                        className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ) : (
                  // FILE
                  <li
                    key={f.id || f.name}
                    className="flex justify-between items-center border p-2 rounded"
                  >
                    {renameTarget === f.name ? (
                      <div className="flex gap-2 items-center">
                        <input
                          className="border px-1 py-0.5 rounded text-sm"
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                        />
                        <button
                          onClick={() => handleRename(f.name, renameValue)}
                          className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setRenameTarget(null)}
                          className="text-sm text-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="truncate max-w-[200px]" title={f.name}>
                          {f.name}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDownload(f.name)}
                            disabled={downloadingFile === f.name}
                            className="bg-green-500 text-white px-2 py-1 rounded text-sm disabled:opacity-50"
                          >
                            {downloadingFile === f.name
                              ? "Downloading…"
                              : "Download"}
                          </button>
                          <button
                            onClick={() => {
                              setRenameTarget(f.name);
                              setRenameValue(f.name);
                            }}
                            className="bg-yellow-400 text-white px-2 py-1 rounded text-sm"
                          >
                            Rename
                          </button>
                          <button
                            onClick={() => handleDelete(f.name)}
                            className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                )
              )}
            </ul>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
