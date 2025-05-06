// This file contains the implementation of a web crawler using Playwright.
// The crawler navigates through web pages starting from a given URL, identifies files based on specified criteria,
// and collects links while adhering to domain restrictions and a maximum crawl limit.

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const { broadcastLog } = require("./socketBroadCaster.js");
const { get } = require("http");

const MAX_LINKS_TO_CRAWL = 200; // Limit the number of links to crawl
const MAX_SECONDS_TO_CRAWL = 4*60; // Maximum time to crawl in seconds

// Timeout for page navigation
const PAGE_LOAD_TIMEOUT = 10*1000;

// Map common extensions to their MIME types
const mimeTypes = {
  ".pdf": ["application/pdf"],
  ".csv": ["text/csv", "application/csv"],
  ".fastq": [
    "application/octet-stream",
    "application/gzip",
    "application/x-gzip",
    "application/fastq",
  ],
};

async function crawlSite({
  startUrl,
  criteriaType,
  searchCriteria,
  fileType,
  username,
  password,
}) {
  const visited = new Set(); // Tracks visited URLs
  const foundFiles = []; // Stores URLs of files matching the criteria
  const browser = await chromium.launch({ headless: true }); // Launch a headless browser

  // Set up browser context with optional HTTP credentials
  const credentials =
    username && password
      ? {
          httpCredentials: {
            username,
            password,
          },
        }
      : null;
  const context = await (credentials
    ? browser.newContext(credentials)
    : browser.newContext());

  const startTime = Date.now();
  const timeoutMilliseconds = MAX_SECONDS_TO_CRAWL * 1000;

  // Helper function to extract file details from a URL or HTTP headers
  const getFileDetails = async (url) => {
    const getFileNameFromUrl = (url) => {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const fileName = path.basename(pathname);
      const fileExtension = path.extname(fileName).toLowerCase();
      // if the file extension is gz, we treat it as a fastq file
      return {
        fileName,
        fileExtension: fileExtension === ".gz" ? ".fastq" : fileExtension,
      };
    };

    const getFileDetailsFromHeaders = (headers) => {
      const contentType = headers["content-type"] || "";
      const contentDisposition = headers["content-disposition"] || "";

      let fileName = null;
      let fileExtension = null;

      // Extract file name from contentDisposition if available
      if (contentDisposition && contentDisposition.includes("filename")) {
        const match = contentDisposition.match(/filename="?([^";]+)"?/i);
        if (match && match[1]) {
          fileName = match[1];
          fileExtension = path.extname(fileName).toLowerCase();
        }
      }

      // Fallback: infer file extension from contentType if not already set
      if (!fileExtension && contentType) {
        const mimeExtensions = Object.entries(mimeTypes).find(([ext, mimes]) =>
          mimes.some((mime) => contentType.includes(mime)),
        );
        if (mimeExtensions) {
          fileExtension = mimeExtensions[0];
        }
      }

      return { fileName, fileExtension };
    };

    // Attempt to retrieve file details using HEAD and Range requests
    const retrieveFileDetailsFromHeadRequest = async (url) => {
      try {
        const response = await context.request.fetch(url, {
          method: "GET",
          headers: { Range: "bytes=0-0" },
        });
        const headers = response.headers();
        return getFileDetailsFromHeaders(headers);
      } catch (err) {
        console.log("retrieveFileDetailsFromHeadRequest failure on:", url, err);
      }
      return { fileName: null, fileExtension: null };
    };

    const retrieveFileDetailsFromRangeRequest = async (url) => {
      try {
        const response = await context.request.fetch(url, { method: "HEAD" });
        headers = response.headers();
        return getFileDetailsFromHeaders(headers);
      } catch (err) {
        console.log(
          "retrieveFileDetailsFromRangeRequest failure on:",
          url,
          err,
        );
      }
      return { fileName: null, fileExtension: null };
    };

    const { fileName: fileNameFromUrl, fileExtension: fileExtensionFromUrl } =
      getFileNameFromUrl(url);

    if (fileNameFromUrl && fileExtensionFromUrl) {
      return { fileName: fileNameFromUrl, fileExtension: fileExtensionFromUrl };
    }

    const { fileName, fileExtension } =
      await retrieveFileDetailsFromHeadRequest(url);

    if (fileName && fileExtension) {
      return { fileName, fileExtension };
    }

    const {
      fileName: fileNameFromRange,
      fileExtension: fileExtensionFromRange,
    } = await retrieveFileDetailsFromRangeRequest(url);
    return {
      fileName: fileNameFromRange || fileName || fileNameFromUrl,
      fileExtension:
        fileExtensionFromRange || fileExtension || fileExtensionFromUrl,
    };
  };

  // Helper: check if a URL response is the desired file type
  async function checkIsDesiredFile(
    url,
    criteriaType,
    searchCriteria,
    searchFileExtension,
  ) {
    let isFile = false;
    let isDesiredFile = false;

    const get_result = () => {
      return {
        isFile,
        isDesiredFile,
      };
    };

    const { fileName, fileExtension } = await getFileDetails(url);
    if (!fileName || !fileExtension) {
      console.log(`File details not found for URL: ${url}`);
      return get_result();
    }
    isFile = true;
    let isFileNameMatch = true;

    // Check if the file name matches the search criteria
    if (searchCriteria) {
      if (criteriaType === "regex") {
        try {
          const regex = new RegExp(searchCriteria, "i");
          isFileNameMatch = regex.test(fileName) || regex.test(url);
        } catch (err) {
          console.warn(`Invalid regex: ${searchCriteria}`, err);
          isFileNameMatch = false;
        }
      } else {
        isFileNameMatch =
          fileName.includes(searchCriteria) || url.includes(searchCriteria);
      }
    }

    // Check if the file extension matches the desired type
    const isFileExtensionMatch = searchFileExtension
      ? fileExtension && fileExtension.includes(searchFileExtension)
      : true;

    isDesiredFile = isFileNameMatch && isFileExtensionMatch;
    return get_result();
  }

  // Helper: check if a link belongs to the same domain as the start URL
  async function isDomainSameAsStartUrl(link) {
    const startUrlObj = new URL(startUrl);
    const linkUrlObj = new URL(link);
    return startUrlObj.hostname === linkUrlObj.hostname;
  }

  // Perform breadth-first traversal of pages starting from the start URL
  async function visitPagesBreadthFirst(startUrl) {
    const queue = [startUrl];
    const page = await context.newPage();

    while (queue.length > 0) {
      if (Date.now() - startTime >= timeoutMilliseconds) {
        console.log("Crawling timed out.");
        broadcastLog(
          `Warning: Crawling timed out after ${MAX_SECONDS_TO_CRAWL} seconds.`,
        );
        return;
      }
      if (visited.size >= MAX_LINKS_TO_CRAWL) {
        console.log("Reached maximum number of links to crawl.");
        break;
      }
      const currentUrl = queue.shift();

      const { isDesiredFile, isFile } = await checkIsDesiredFile(
        currentUrl,
        criteriaType,
        searchCriteria,
        fileType,
      );
      // Broadcast a message. Include whether the URL is a file or not and whether it matches the criteria.
      const isFileMessage = isFile ? "is a file" : "is not a file. So checking the page whether it has URLs";
      const isDesiredFileMessage = isDesiredFile
        ? "and matches the criteria"
        : "but does not match the criteria";

      broadcastLog(
        `Info: URL ${isFileMessage} ${isFile ? isDesiredFileMessage : ""} - ${currentUrl}`,
      );
      if (isDesiredFile) {
        if (!foundFiles.includes(currentUrl)) {
          foundFiles.push(currentUrl);
          console.log(
            `Found file: ${currentUrl} on after visiting ${visited.size} links`,
          );
        }
        continue;
      }
      if (isFile) {
        console.log(`Url is a file but not matching criteria: ${currentUrl}`);
        continue;
      }

      try {
        await page.goto(currentUrl, {
          waitUntil: "domcontentloaded",
          timeout: PAGE_LOAD_TIMEOUT,
        });
      } catch (err) {
        console.log("Error navigating to URL:", currentUrl, err);
        broadcastLog(
          `Error: Failed to navigate to ${currentUrl}. Skipping this URL.`,
        );
        continue;
      }

      // Extract all links from the current page
      const links = await page.$$eval("a", (anchors) =>
        anchors.map((a) => a.href).filter((href) => !!href),
      );
      console.log(`Found ${links.length} links on ${currentUrl}`);

      // Add unvisited links from the same domain to the queue
      for (const link of links) {
        if ((await isDomainSameAsStartUrl(link)) && !visited.has(link)) {
          visited.add(link);
          queue.push(link);
        }
      }
    }
  }

  await visitPagesBreadthFirst(startUrl);
  await browser.close();
  console.log(`Crawling completed. ${visited.size} Visited links:`, visited);
  broadcastLog(
    `Info: Crawling completed. ${visited.size} links crawled in ${Math.floor(
      (Date.now() - startTime) / 1000,
    )} seconds.`,
  );
  return foundFiles;
}

module.exports = { crawlSite };
