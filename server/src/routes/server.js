const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const crawlRoute = require("./routes/crawl");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/crawl", crawlRoute);

app.listen(9000, () => {
  console.log("Server running at http://localhost:9000");
});
