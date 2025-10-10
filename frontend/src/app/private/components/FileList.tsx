"use client";
export default function FileList({
  files,
  currentFolder,
  enterFolder,
  renameFolder,
  deleteFolderRecursive,
  downloadFolderRecursive,
  handleRename,
  handleDelete,
  handleDownload,
  downloadingFile,
  setRenameTarget,
  renameTarget,
  renameValue,
  setRenameValue,
}: any) {
  return (
    <ul className="space-y-2">
      {files.map((f: any) =>
        f.metadata === null ? (
          <li
            key={f.name}
            className="flex justify-between items-center border p-2 rounded hover:bg-gray-50"
          >
            <span onClick={() => enterFolder(f.name)}>📁 {f.name}</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const newName = prompt("Rename folder:", f.name);
                  if (newName && newName.trim())
                    renameFolder(f.name, newName.trim(), currentFolder);
                }}
                className="bg-yellow-400 text-white px-2 py-1 rounded text-sm"
              >
                Rename
              </button>
              <button
                onClick={() => deleteFolderRecursive(f.name, currentFolder)}
                className="bg-red-500 text-white px-2 py-1 rounded text-sm"
              >
                Delete
              </button>
              <button
                onClick={() => downloadFolderRecursive(f.name, currentFolder)}
                className="bg-green-600 text-white px-2 py-1 rounded text-sm"
              >
                Download
              </button>
            </div>
          </li>
        ) : (
          <li
            key={f.name}
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
                <span>{f.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(f.name)}
                    disabled={downloadingFile === f.name}
                    className="bg-green-500 text-white px-2 py-1 rounded text-sm disabled:opacity-50"
                  >
                    {downloadingFile === f.name ? "Downloading…" : "Download"}
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
  );
}
