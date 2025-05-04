require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Import the web crawler route
const crawlRoute = require("./routes/crawl");
const frontendRouter = require("./routes/frontendRouter");

const app = express();

// Step 1: Enable CORS
const allowedOrigins = [
  "http://localhost:3000", // React frontend
  "http://localhost:9000", // Backend
  "https://intelligent-crawler-3b670dc3d6b4.herokuapp.com", // Your deployed app (if any)
  "https://intelligent-crawler.onrender.com/", // Https for render.com
  "http://intelligent-crawler.onrender.com/", // Http for render.com
];

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      // Allow requests from specific origins
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  }),
); // Enable CORS for the allowed origins

// Step 2: Middleware for JSON body parsing
app.use(bodyParser.json()); // Parse JSON bodies

// Step 3: API Route for the Web Crawler
app.use("/api", crawlRoute); // Mount the /crawl route from routes/crawl.js

// Step 3.1: Serve static files from the React app
app.use("/", frontendRouter); // Serve static files from the React app

// Step 4: Start the server
// const PORT = process.env.PORT || 9000;
const PORT = 9000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
