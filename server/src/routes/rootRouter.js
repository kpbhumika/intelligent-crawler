const express = require("express");
const testRouter = require("./api/test.js");
const rootRouter = new express.Router();

rootRouter.use("/api/test", testRouter);

module.exports = rootRouter;
