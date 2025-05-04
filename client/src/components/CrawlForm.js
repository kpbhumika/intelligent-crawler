import React from "react";
import { Form, Button, Spinner } from "react-bootstrap";

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
    <Form>
      <Form.Group className="mb-3" controlId="formStartUrl">
        <Form.Label>Start URL</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter start URL"
          value={startUrl}
          onChange={(e) => setStartUrl(e.target.value)}
        />
      </Form.Group>

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

      <Form.Group className="mb-3" controlId="formCriteria">
        <Form.Label>Search Criteria</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter search criteria"
          value={criteria}
          onChange={(e) => setCriteria(e.target.value)}
        />
      </Form.Group>

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
