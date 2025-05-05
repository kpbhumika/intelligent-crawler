// This file defines the CrawlForm component, which provides a user interface for configuring and starting a web crawling process.
// It includes fields for specifying the start URL, search criteria, file type, and optional authentication credentials.

import React, { useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";

const CrawlForm = ({
  loading, // Indicates whether the crawling process is currently in progress
  setStartUrl, // Function to update the start URL
  setCriteriaType, // Function to update the criteria type (e.g., keyword or regex)
  setCriteria, // Function to update the search criteria
  setFileType, // Function to update the file type to search for
  startUrl, // Current value of the start URL
  criteriaType, // Current value of the criteria type
  criteria, // Current value of the search criteria
  fileType, // Current value of the file type
  username, // Current value of the username for authentication
  setUsername, // Function to update the username
  password, // Current value of the password for authentication
  setPassword, // Function to update the password
  handleCrawl, // Function to initiate the crawling process
}) => {
  const [authEnabled, setAuthEnabled] = useState(false); // State to toggle authentication fields

  return (
    <Form>
      {/* Input field for the start URL */}
      <Form.Group className="mb-3" controlId="formStartUrl">
        <Form.Label>Start URL</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter start URL"
          value={startUrl}
          onChange={(e) => setStartUrl(e.target.value)}
        />
      </Form.Group>

      {/* Dropdown to select the criteria type */}
      <Form.Group className="mb-3" controlId="formCriteriaType">
        <Form.Label>Criteria Type</Form.Label>
        <Form.Select
          value={criteriaType}
          onChange={(e) => setCriteriaType(e.target.value)}
        >
          <option value="keyword">Keyword</option>
          <option value="regex">Regex</option>
        </Form.Select>
      </Form.Group>

      {/* Input field for the search criteria */}
      <Form.Group className="mb-3" controlId="formCriteria">
        <Form.Label>Search Criteria</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter search criteria"
          value={criteria}
          onChange={(e) => setCriteria(e.target.value)}
        />
      </Form.Group>

      {/* Dropdown to select the file type */}
      <Form.Group className="mb-3" controlId="formFileType">
        <Form.Label>File Type</Form.Label>
        <Form.Select
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
        >
          <option value=".pdf">.PDF</option>
          <option value=".csv">.CSV</option>
          <option value=".fastq">.FASTQ</option>
        </Form.Select>
      </Form.Group>

      {/* Checkbox to enable or disable authentication */}
      <Form.Group className="mb-3" controlId="formAuthEnabled">
        <Form.Check
          type="checkbox"
          label="Enable Authentication"
          checked={authEnabled}
          onChange={(e) => setAuthEnabled(e.target.checked)}
        />
      </Form.Group>

      {/* Authentication fields (username and password) displayed only if authEnabled is true */}
      {authEnabled && (
        <>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
        </>
      )}

      {/* Button to start the crawling process, with a spinner displayed when loading */}
      <Button
        variant="primary"
        onClick={handleCrawl}
        disabled={loading}
        className="mt-3"
      >
        {loading ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />{" "}
            Crawling...
          </>
        ) : (
          "Start Crawl"
        )}
      </Button>
    </Form>
  );
};

export default CrawlForm;
