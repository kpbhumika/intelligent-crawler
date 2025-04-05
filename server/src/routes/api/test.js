const express = require("express");

const testRouter = express.Router();

// fetch user decks
testRouter.get("/", async (req, res) => {
  const testData = { message: "This is a test route!" };
  return res.status(200).json(testData);
});
module.exports = testRouter;
