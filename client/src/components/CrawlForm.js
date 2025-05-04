import React, { useState } from "react";

const CrawlForm = ({
  loading,
  setStartUrl,
  setCriteriaType,
  setCriteria,
  setFileType,
  startUrl,
  criteriaType,
  criteria,
  fileType,
  handleCrawl,
}) => {
  return (
    <>
      <label className="block mb-2">
        Start URL:
        <input
          type="text"
          className="w-full p-2 border mt-1"
          value={startUrl}
          onChange={(e) => setStartUrl(e.target.value)}
        />
      </label>

      <label className="block mb-2">
        Criteria Type:
        <select
          className="w-full p-2 border mt-1"
          value={criteriaType}
          onChange={(e) => setCriteriaType(e.target.value)}
        >
          <option value="keyword">Keyword</option>
          <option value="regex">Regex</option>
        </select>
      </label>

      <label className="block mb-2">
        Search Criteria:
        <input
          type="text"
          className="w-full p-2 border mt-1"
          value={criteria}
          onChange={(e) => setCriteria(e.target.value)}
        />
      </label>

      <label className="block mb-2">
        File Type:
        <select
          className="w-full p-2 border mt-1"
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
        >
          <option value=".pdf">.PDF</option>
          <option value=".csv">.CSV</option>
          <option value=".fastq">.FASTQ</option>
        </select>
      </label>

      <button
        onClick={handleCrawl}
        className="bg-blue-600 text-white px-4 py-2 mt-4 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Crawling..." : "Start Crawl"}
      </button>
    </>
  );
};

export default CrawlForm;