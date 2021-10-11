const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = 1234;

app.use(cors());
app.use(express.json());

// @ts-expect-error
app.post("/", (req, res) => {
  const data = req.body ?? "";
  console.log({ data });
  const stringified = JSON.stringify(data);
  console.log({ stringified });
  const sanitized = stringified.replace(/\n/g, "");
  fs.appendFile("data.json", sanitized + "\n", console.error);
  res.send("ok");
});

app.listen(port, () =>
  console.log(
    `react-proptypes-runtime-generator server listening on port ${port}`
  )
);
