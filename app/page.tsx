"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [task, setTask] = useState("");
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!url || !task) return;

    setLoading(true);
    setError("");
    setFiles([]);

    try {
      const res = await fetch("/api/fetch-repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setFiles(data.files);
    } catch (err) {
      setError("Failed to fetch repository");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold text-gray-900 mb-2">ContextForge</h1>
      <p className="text-gray-500 mb-10">
        Paste a GitHub repo and describe your task. Get a precise, context-aware prompt back.
      </p>

      <div className="flex flex-col gap-4 mb-6">
        <input
          type="text"
          placeholder="https://github.com/owner/repo"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-400"
        />
        <textarea
          placeholder="What do you want to do? e.g. add dark mode to the settings page"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          rows={3}
          className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-400 resize-none"
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !url || !task}
          className="bg-gray-900 text-white rounded-lg px-6 py-3 text-sm font-medium hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Fetching repo..." : "Analyze Repo"}
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

      {files.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-3">{files.length} files found</p>
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            {files.slice(0, 50).map((file) => (
              <div
                key={file.sha}
                className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100 last:border-0 font-mono"
              >
                {file.path}
              </div>
            ))}
            {files.length > 50 && (
              <div className="px-4 py-2 text-sm text-gray-400">
                ...and {files.length - 50} more files
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}