"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/utils/supabase/client";
import { listFiles, downloadFile, uploadFile } from "@/utils/supabase/storage";
import { useStorageActions } from "./components/useStorageActions";
import HeaderBar from "./components/HeaderBar";
import FolderNavigator from "./components/FolderNavigator";
import UploadPanel from "./components/UploadPanel";
import FileList from "./components/FileList";

export default function PrivatePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [currentFolder, setCurrentFolder] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [renameTarget, setRenameTarget] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [history, setHistory] = useState([""]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Auth & initial fetch
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return router.push("/auth");
      setUser(user);
      fetchFiles("");
    });
  }, []);

  const fetchFiles = async (path: string) => {
    if (!user) return;
    const prefix = `${user.id}/${path}`;
    const cleanPath =
      prefix.endsWith("/") || prefix === "" ? prefix : `${prefix}/`;
    const data = await listFiles("uploads", cleanPath);
    setFiles((data || []).filter((f) => f.name !== ".keep"));
  };

  const {
    isBusy,
    downloadingFile,
    setDownloadingFile,
    upload,
    createFolder,
    deleteFile,
    deleteFolderRecursive,
    renameFolder,
    downloadFolderRecursive,
  } = useStorageActions(user, fetchFiles);

  // Navigation
  const enterFolder = (name: string) => {
    const newPath = `${currentFolder}${name}/`;
    setCurrentFolder(newPath);
    fetchFiles(newPath);
    const newHist = [...history.slice(0, historyIndex + 1), newPath];
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);
  };

  const goUp = () => {
    const parts = currentFolder.split("/").filter(Boolean);
    parts.pop();
    const parent = parts.join("/") + "/";
    setCurrentFolder(parent);
    fetchFiles(parent);
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

  if (!user) return <p className="p-6 text-center">Checking authentication…</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <HeaderBar
        user={user}
        isBusy={isBusy}
        onLogout={() => router.push("/auth")}
      />
      <FolderNavigator
        currentFolder={currentFolder}
        historyIndex={historyIndex}
        history={history}
        goBack={goBack}
        goForward={goForward}
        goUp={goUp}
        onNavigate={(path: string) => {
          setCurrentFolder(path);
          fetchFiles(path);
        }}
      />
      <UploadPanel
        file={file}
        setFile={setFile}
        newFolderName={newFolderName}
        setNewFolderName={setNewFolderName}
        handleUpload={() => upload(file!, currentFolder)}
        handleCreateFolder={() => createFolder(newFolderName, currentFolder)}
        handleDownloadAll={() => downloadFolderRecursive(currentFolder, "")}
        isUploading={isBusy}
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentFolder}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <FileList
            files={files}
            currentFolder={currentFolder}
            enterFolder={enterFolder}
            renameFolder={renameFolder}
            deleteFolderRecursive={deleteFolderRecursive}
            downloadFolderRecursive={downloadFolderRecursive}
            handleRename={() => {}}
            handleDelete={(f: string) => deleteFile(f, currentFolder)}
            handleDownload={() => {}}
            downloadingFile={downloadingFile}
            setRenameTarget={setRenameTarget}
            renameTarget={renameTarget}
            renameValue={renameValue}
            setRenameValue={setRenameValue}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
