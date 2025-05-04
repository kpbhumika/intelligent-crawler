import React, { useState } from "react";
import axios from "axios";
import LogDisplayer from "./components/LogDisplayer";
import CrawlForm from "./components/CrawlForm";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  // Form Fields
  const [startUrl, setStartUrl] = useState("");
  const [criteriaType, setCriteriaType] = useState("keyword");
  const [criteria, setCriteria] = useState("");
  const [fileType, setFileType] = useState(".pdf");

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

      <CrawlForm
        loading={loading}
        setStartUrl={setStartUrl}
        setCriteriaType={setCriteriaType}
        setCriteria={setCriteria}
        setFileType={setFileType}
        startUrl={startUrl}
        criteriaType={criteriaType}
        criteria={criteria}
        fileType={fileType}
        handleCrawl={handleCrawl}
      />

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
