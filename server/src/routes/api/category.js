const express = require("express");
const Category = require("../../models/Category");

const categoryRouter = express.Router();

// Fetch all categories
categoryRouter.get("/", async (req, res) => {
  try {
    const categories = await Category.query();
    return res.status(200).json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res
      .status(500)
      .json({ errors: error.message || "Internal Server Error" });
  }
});

module.exports = categoryRouter;
