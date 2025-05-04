const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const { broadcastLog } = require("./socketBroadCaster.js");
const { get } = require("http");

const MAX_LINKS_TO_CRAWL = 200; // Limit the number of links to crawl

// Timeout for page navigation loaded from env variable
// const PAGE_LOAD_TIMEOUT = process.env.PAGE_LOAD_TIMEOUT
//   ? parseInt(process.env.PAGE_LOAD_TIMEOUT)
//   : 60000;

const PAGE_LOAD_TIMEOUT = 60000;


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

async function crawlSite({ startUrl, criteriaType, searchCriteria, fileType }) {
  const visited = new Set();
  const foundFiles = [];
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  const getFileDetails = async (url) => {
    const getFileNameFromUrl = (url) => {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const fileName = path.basename(pathname);
      const fileExtension = path.extname(fileName).toLowerCase();
      return { fileName, fileExtension };
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
    }

    const { fileName, fileExtension } = await getFileDetails(url);
    if (!fileName || !fileExtension) {
      console.log(`File details not found for URL: ${url}`);
      return get_result();
    }
    isFile = true;
    let isFileNameMatch = true;

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

    const isFileExtensionMatch = searchFileExtension
      ? fileExtension && fileExtension.includes(searchFileExtension)
      : true;

    isDesiredFile = isFileNameMatch && isFileExtensionMatch;
    return get_result();
  }

  async function isDomainSameAsStartUrl(link) {
    const startUrlObj = new URL(startUrl);
    const linkUrlObj = new URL(link);
    return startUrlObj.hostname === linkUrlObj.hostname;
  }

  // async function visitPage(url) {
  //   if (visited.has(url)) return;
  //   visited.add(url);

  //   const page = await context.newPage();
  //   await page.goto(url, { waitUntil: 'domcontentloaded' });

  //   const links = await page.$$eval('a', anchors =>
  //     anchors.map(a => a.href).filter(href => !!href)
  //   );
  //   console.log(`Found ${links.length} links on ${url}`);

  //   for (const link of links) {
  //     // Only consider links containing the criteria
  //     if (!link.includes(searchCriteria)) continue;

  //     // If URL ends with the extension, we can skip checking headers
  //     const obviousFile = link.toLowerCase().endsWith(fileType);
  //     let isFile = obviousFile;

  //     if (!obviousFile) {
  //       // Check headers to see if this link is actually a file
  //       isFile = await isDesiredFile(link);
  //     }

  //     if (isFile) {
  //       if (!foundFiles.includes(link)) {
  //         foundFiles.push(link);
  //         console.log(`Found file: ${link}`);
  //       }
  //       continue; // Don't crawl further
  //     }

  //     // Crawl further if same domain
  //     if (isDomainSameAsStartUrl(link) && !visited.has(link)) {
  //       await visitPage(link);
  //     }
  //   }

  //   await page.close();
  // }

  async function visitPagesBreadthFirst(startUrl) {
    const queue = [startUrl];
    // visited.add(startUrl);

    while (queue.length > 0) {
      if (visited.size >= MAX_LINKS_TO_CRAWL) {
        console.log("Reached maximum number of links to crawl.");
        break;
      }
      const currentUrl = queue.shift();
      broadcastLog(`Crawling - ${currentUrl}`);

      const {isDesiredFile, isFile} = await checkIsDesiredFile(
        currentUrl,
        criteriaType,
        searchCriteria,
        fileType,
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
        console.log(
          `Url is a file but not matching criteria: ${currentUrl}`,
        );
        continue;
      }

      const page = await context.newPage();
      try {
        await page.goto(currentUrl, {
          waitUntil: "domcontentloaded",
          timeout: PAGE_LOAD_TIMEOUT,
        });
      } catch (err) {
        console.log("Error navigating to URL:", currentUrl, err);
        continue;
      }

      const links = await page.$$eval("a", (anchors) =>
        anchors.map((a) => a.href).filter((href) => !!href),
      );
      console.log(`Found ${links.length} links on ${currentUrl}`);

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
  return foundFiles;
}

module.exports = { crawlSite };
