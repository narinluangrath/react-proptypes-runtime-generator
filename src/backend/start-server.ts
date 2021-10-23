import express from "express";
import fs from "fs";
import cors from "cors";
import path from "path";

export function startServer() {
  const app = express();
  const config = require(path.join(process.cwd(), ".storystrap/config.js"));
  const port = config?.port || 1234;

  app.use(cors());
  app.use(express.json());

  app.post("/", (req, res) => {
    const data = req.body ?? "";
    const stringified = JSON.stringify(data);
    const sanitized = stringified.replace(/\n/g, "");
    fs.appendFile("data.json", sanitized + "\n", (err) => {
      if (err) {
        console.error(err);
      }
    });
    res.send("ok");
  });

  app.listen(port, () =>
    console.log(`react-storystrap server listening on port ${port}`)
  );
}
