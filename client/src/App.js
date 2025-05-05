// This file defines the main React component for the Intelligent Web Crawler application.
// It handles the user interface, form inputs, and interactions with the backend API.

import React, { useState } from "react";
import axios from "axios";
import LogDisplayer from "./components/LogDisplayer";
import CrawlForm from "./components/CrawlForm";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  // State variables for managing loading status, results, and error messages
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  // State variables for form fields
  const [startUrl, setStartUrl] = useState(""); // Starting URL for the crawl
  const [criteriaType, setCriteriaType] = useState("keyword"); // Type of search criteria
  const [criteria, setCriteria] = useState(""); // Search criteria value
  const [fileType, setFileType] = useState(".pdf"); // File type to search for
  const [username, setUsername] = useState(""); // Optional username for authentication
  const [password, setPassword] = useState(""); // Optional password for authentication

  // Function to handle the crawl operation
  const handleCrawl = async () => {
    setLoading(true); // Show loading indicator
    setResults([]); // Clear previous results
    setError(""); // Clear previous errors
    try {
      // Send a POST request to the backend API with crawl parameters
      const res = await axios.post(`/api/crawl`, {
        startUrl,
        criteriaType,
        searchCriteria: criteria,
        fileType,
      });

      console.log("Crawl Response:", res.data); // Log the response for debugging

      setResults(res.data.files); // Update results with the files found
    } catch (err) {
      // Handle errors and display an appropriate message
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <div className="container py-4">
      <h1 className="display-4 text-center mb-4">🕷 Intelligent Web Crawler</h1>

      <div className="row justify-content-center">
        <div className="col-md-8">
          {/* Form component for user inputs */}
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

          {/* Display error messages if any */}
          {error && (
            <div className="alert alert-danger mt-4" role="alert">
              {error}
            </div>
          )}

          {/* Display the list of found files */}
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

          {/* Component to display logs */}
          <div className="mt-5">
            <LogDisplayer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
