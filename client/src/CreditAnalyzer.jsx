import React, { useState } from "react";
import { analyzePDF } from "./api";

export default function CreditAnalyzer() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Upload a PDF first!");
    const response = await analyzePDF(file);
    setResult(response);
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Analyze PDF
      </button>

      {result && (
        <pre className="mt-4 bg-gray-200 p-4 rounded">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}