const express = require("express");
const router = express.Router();
const { crawlSite } = require("../config/crawler");

const crawlRouter = express.Router();
crawlRouter.use("/crawl", router);

router.post("/", async (req, res) => {
  const { startUrl, criteriaType, searchCriteria, fileType } = req.body;

  try {
    const files = await crawlSite({
      startUrl,
      criteriaType,
      searchCriteria,
      fileType,
    });
    res.json({ success: true, files });
  } catch (error) {
    console.error("Crawler error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = crawlRouter;
