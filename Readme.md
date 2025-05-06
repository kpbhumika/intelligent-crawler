# Intelligent Crawler

The Intelligent Crawler is a full-stack web application built using **React** for the frontend and **Node.js** with **Playwright** for the backend. It enables users to efficiently search for and download specific file types (like `.PDF`, `.CSV`, `.FASTQ`) from websites based on custom criteria. It features smart crawling with link traversal, regex/keyword matching, and optional authentication — all within a modern web UI.

**GitHub Repository**: [https://github.com/kpbhumika/intelligent-crawler](https://github.com/kpbhumika/intelligent-crawler)
**Live Demo**: [https://intelligent-crawler.onrender.com](https://intelligent-crawler.onrender.com)

## Features

* **Targeted Web Crawling**: Crawl websites to discover downloadable files based on user-defined search logic.
* **Flexible Search Criteria**: Choose between keyword or regex-based filtering to match URLs or file names.
* **File Format Support**: Retrieve specific types of files (.PDF, .CSV, .FASTQ).
* **Authentication Handling**: Supports optional login credentials when required to access restricted pages.
* **Built with Playwright**: Uses headless browsing for realistic and accurate web scraping.
* **Dockerized Deployment**: Easily deploy using Docker for consistent setup across environments.

## Tech Stack

* **Frontend**: React
* **Backend**: Node.js with Playwright
* **Containerization**: Docker

## How to Use

1. **Start URL**
   Enter the website URL where crawling should begin.
   *Example*: `https://people.sc.fsu.edu/~jburkardt/data/csv/`

2. **Criteria Type**
   Choose between:

   * `Keyword`: Matches basic substrings in URLs or file names.
   * `Regex`: Allows advanced matching using regular expressions.
     *Example for regex*: `.*tiny.*`

3. **Search Criteria**
   Provide the keyword or regex pattern used to filter links and file names.
   *Example keyword*: `example`
   *Example regex*: `.*tiny.*`

4. **File Type**
   Select from supported file types:

   * `.PDF`
   * `.CSV`
   * `.FASTQ`

5. **Enable Authentication** (optional)
   Toggle the checkbox if the website requires login. Provide:

   * **Username**
   * **Password**

6. **Start Crawl**
   Click the **"Start Crawl"** button. The crawler will begin scanning the site and return a list of files that match the criteria.

## Example Inputs

### Example 1 – Keyword Match

* **Start URL**: `https://people.sc.fsu.edu/~jburkardt/data/csv/`
* **Criteria Type**: Keyword
* **Search Criteria**: `example`
* **File Type**: `.CSV`

### Example 2 – Regex Match

* **Start URL**: `https://ftp.mi.fu-berlin.de/pub/andreott/knime_ngs/fastq/`
* **Criteria Type**: Regex
* **Search Criteria**: `.*tiny.*`
* **File Type**: `.FASTQ`

## How to Run

1. **Clone the Repository**

   ```sh
   git clone https://github.com/kpbhumika/intelligent-crawler.git
   cd intelligent-crawler
   ```

2. **Build and Run with Docker**

   ```sh
   docker build -t intelligent-crawler .
   docker run -p 3000:3000 intelligent-crawler
   ```

3. **Access the App**
   Open [http://localhost:3000](http://localhost:3000) in your browser.
