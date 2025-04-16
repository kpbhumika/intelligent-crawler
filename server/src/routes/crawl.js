const express = require('express');
const router = express.Router();
const { crawlSite } = require('../config/crawler');

router.post('/', async (req, res) => {
  const { startUrl, searchCriteria, fileType } = req.body;

  try {
    const files = await crawlSite({ startUrl, searchCriteria, fileType });
    res.json({ success: true, files });
  } catch (error) {
    console.error('Crawler error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
