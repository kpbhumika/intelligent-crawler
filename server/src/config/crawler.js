const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function crawlSite({ startUrl, searchCriteria, fileType }) {
  const visited = new Set();
  const foundFiles = [];

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  async function visitPage(url) {
    if (visited.has(url)) return;
    visited.add(url);

    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Extract all links on the page
    const links = await page.$$eval('a', anchors =>
      anchors.map(a => a.href).filter(href => !!href)
    );

    console.log(`Found ${links.length} links on ${url}`);

    for (let link of links) {
      // Check if the link matches the search criteria and file type
      if (
        link.includes(searchCriteria) &&  // Search for the criteria in the URL
        link.toLowerCase().endsWith(fileType)  // Match the desired file type
      ) {
        if (!foundFiles.includes(link)) {
          foundFiles.push(link);
          console.log(`Found file: ${link}`);
        }
      }

      // If the link is a direct file (e.g., CSV), skip the page navigation
      const isFileLink = link.toLowerCase().endsWith(fileType);
      if (isFileLink) {
        // Skip adding to visited and don't navigate further
        continue;
      }

      // Recursively crawl linked pages within the same domain
      if (link.includes(startUrl) && !visited.has(link)) {
        await visitPage(link);
      }
    }

    await page.close();
  }

  await visitPage(startUrl);

  await browser.close();
  return foundFiles;
}

module.exports = { crawlSite };
