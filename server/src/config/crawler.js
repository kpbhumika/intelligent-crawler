const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function crawlSite({ startUrl, searchCriteria, fileType, timeout = 20000 }) {
  const visited = new Set();
  const foundFiles = new Set();
  const baseDomain = new URL(startUrl).hostname;

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  const MAX_PAGES = 50;
  let pageCount = 0;

  async function visitPage(url) {
    if (visited.has(url) || pageCount >= MAX_PAGES) return;
    visited.add(url);
    pageCount++;

    console.log(`Visiting: ${url}`);

    const page = await context.newPage();
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout });

      const links = await page.$$eval('a', as =>
        as.map(a => a.href).filter(href => !!href)
      );

      console.log(`Extracted links from ${url}:`, links);

      for (let link of links) {
        // Resolve relative URLs to absolute URLs
        try {
          link = new URL(link, url).href;
        } catch (err) {
          console.warn(`Invalid URL skipped: ${link}`);
          continue;
        }

        if (visited.has(link)) continue;

        let isSameDomain = false;
        let isPDF = false;
        let matchesSearch = false;

        try {
          const parsedLink = new URL(link);
          isSameDomain = parsedLink.hostname.endsWith(baseDomain);
          isPDF = parsedLink.pathname.toLowerCase().endsWith(fileType.toLowerCase());
          matchesSearch = parsedLink.pathname.toLowerCase().includes(searchCriteria.toLowerCase());
        } catch (err) {
          console.warn(`Invalid URL skipped: ${link}`);
          continue;
        }

        if (isPDF && matchesSearch) {
          if (!foundFiles.has(link)) {
            console.log(`Found file: ${link}`);
            foundFiles.add(link);
          }
        } else if (isSameDomain && !link.includes('#')) {
          await visitPage(link);
        }
      }
    } catch (err) {
      console.warn(`Skipped ${url} — ${err.message}`);
    } finally {
      await page.close();
    }
  }

  await visitPage(startUrl);

  const downloadsDir = path.resolve(__dirname, '../../downloads');
  if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir, { recursive: true });

  for (let fileUrl of foundFiles) {
    try {
      const fileName = path.basename(fileUrl.split('?')[0]).replace(/[^a-zA-Z0-9_\-.]/g, '_');
      const filePath = path.join(downloadsDir, fileName);
      const response = await axios.get(fileUrl, { responseType: 'stream' });

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      console.log(`Downloaded: ${fileName}`);
    } catch (err) {
      console.error(`Download failed: ${fileUrl} — ${err.message}`);
    }
  }

  console.log(`Crawling completed. Found files:`, Array.from(foundFiles));
  await browser.close();
  return Array.from(foundFiles);
}

module.exports = { crawlSite };