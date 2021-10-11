const express = require("express");
const fs = require("fs");

const app = express();
const port = 1234;
const delimiter = "\n";

app.use(express.json());

// @ts-expect-error
app.post("/", (req, res) => {
  const data = req.body ?? "";
  const sanitized = data.replaceAll(delimiter, "");
  fs.appendFile("data.json", sanitized + delimiter, console.error);
  res.send("ok");
});

app.listen(port, () =>
  console.log(
    `react-proptypes-runtime-generator server listening on port ${port}`
  )
);
