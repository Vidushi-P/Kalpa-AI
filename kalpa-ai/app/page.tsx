"use client";
import { useState } from "react";

export default function Home() {
  const [logs, setLogs] = useState("Waiting for upload...");

  async function handleUpload(e: any) {
    const file = e.target.files[0];
    if (!file) return;

    setLogs("Uploading and parsing...");

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/parse-pdf", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setLogs(JSON.stringify(data, null, 2));
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">PDF Parser Test</h1>
      <input type="file" onChange={handleUpload} className="border p-2 mb-4" />
      <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-auto h-96">
        {logs}
      </pre>
    </div>
  );
}