"use client";
import { motion } from "framer-motion";

export default function UploadPanel({
  file,
  setFile,
  newFolderName,
  setNewFolderName,
  handleUpload,
  handleCreateFolder,
  handleDownloadAll,
  isUploading,
}: any) {
  return (
    <div className="mb-6">
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
      {isUploading && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="h-1 bg-blue-500 mt-2 rounded"
        />
      )}
    </div>
  );
}
