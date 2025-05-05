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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
    <div className="container py-4">
      <h1 className="display-4 text-center mb-4">🕷 Intelligent Web Crawler</h1>

      <div className="row justify-content-center">
        <div className="col-md-8">
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
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            handleCrawl={handleCrawl}
          />

          {error && (
            <div className="alert alert-danger mt-4" role="alert">
              {error}
            </div>
          )}

          <div className="mt-5">
            <h2 className="h5 mb-3">📄 Found Files:</h2>
            {results.length > 0 ? (
              <ul className="list-group">
                {results.map((url, idx) => (
                  <li key={idx} className="list-group-item">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none text-primary"
                    >
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No files found yet.</p>
            )}
          </div>

          <div className="mt-5">
            <LogDisplayer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
