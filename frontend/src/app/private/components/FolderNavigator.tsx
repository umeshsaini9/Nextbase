"use client";

export default function FolderNavigator({
  currentFolder,
  historyIndex,
  history,
  goBack,
  goForward,
  goUp,
  onNavigate,
}: any) {
  const breadcrumbs = currentFolder
    ? currentFolder.split("/").filter(Boolean)
    : [];

  return (
    <div className="flex items-center gap-2 mb-4">
      <button
        onClick={goBack}
        disabled={historyIndex === 0}
        className="bg-gray-200 px-2 py-1 rounded disabled:opacity-50"
      >
        ←
      </button>
      <button
        onClick={goForward}
        disabled={historyIndex === history.length - 1}
        className="bg-gray-200 px-2 py-1 rounded disabled:opacity-50"
      >
        →
      </button>
      <button
        onClick={goUp}
        disabled={!currentFolder}
        className="bg-gray-200 px-2 py-1 rounded disabled:opacity-50"
      >
        ⬆
      </button>

      <div className="flex flex-wrap items-center gap-1 text-sm text-gray-700">
        <span
          onClick={() => onNavigate("")}
          className="cursor-pointer hover:underline"
        >
          Root
        </span>
        {breadcrumbs.map((crumb: string, i: number) => (
          <span key={i} className="flex items-center gap-1">
            <span>/</span>
            <span
              className="cursor-pointer hover:underline"
              onClick={() =>
                onNavigate(breadcrumbs.slice(0, i + 1).join("/") + "/")
              }
            >
              {crumb}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
