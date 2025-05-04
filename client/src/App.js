import React, { useState } from "react";
import axios from "axios";
import LogDisplayer from "./components/LogDisplayer";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [startUrl, setStartUrl] = useState("");
  const [criteriaType, setCriteriaType] = useState("keyword");
  const [criteria, setCriteria] = useState("");
  const [fileType, setFileType] = useState(".pdf");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleCrawl = async () => {
    setLoading(true);
    setResults([]);
    setError("");
    try {
      const res = await axios.post(`/api/crawl`, {
        startUrl,
        criteriaType,
        searchCriteria: criteria,
        fileType,
      });

      console.log("Crawl Response:", res.data); // Log the response for debugging

      setResults(res.data.files);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🕷 Intelligent Web Crawler</h1>

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

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">📄 Found Files:</h2>
        <ul className="list-disc list-inside space-y-1">
          {results ? (
            results.map((url, idx) => (
              <li key={idx}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {url}
                </a>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No files found yet.</p>
          )}
          <li>
            <LogDisplayer />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default App;
