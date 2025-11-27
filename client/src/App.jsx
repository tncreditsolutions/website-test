import React from "react";
import CreditAnalyzer from "./CreditAnalyzer";

export default function App() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Credit Report Analyzer</h1>
      <CreditAnalyzer />
    </div>
  );
}