const path = require("path");
const express = require("express");

const frontendRouter = new express.Router();

frontendRouter.use(
  express.static(path.join(__dirname, "../../../client/build")),
);
// frontendRouter.get("*", (req, res) => {
//   path.join(__dirname, "../../../client/build/index.html");
// });

frontendRouter.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../../client/build", "index.html"));
});

module.exports = frontendRouter;
