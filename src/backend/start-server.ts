import express from "express";
import path from "path";
import fs from "fs";
import cors from "cors";
import type { ComponentId, PropsInstance } from "../types";

function countNonNulls(obj: object): number {
  return Object.values(obj).reduce((acc, value) => {
    if (value !== null && value !== undefined) {
      return acc + 1;
    }
    return acc;
  }, 0);
}

export function startServer() {
  const app = express();
  const config = require(path.join(process.cwd(), ".storystrap/config.js"));
  const data: Record<ComponentId, PropsInstance> = require(path.join(
    process.cwd(),
    ".storystrap/data.js"
  ));
  const port = config?.port || 1234;

  app.use(cors());
  app.use(express.json());

  app.post("/", (req, res) => {
    const { componentId, propsInstance } = req.body ?? {};
    if (!componentId) {
      console.error("componentId missing, discarding data", req.body);
      return;
    }
    if (!propsInstance || typeof propsInstance !== "object") {
      console.error(
        "propsInstance missing or non-object, discarding data",
        req.body
      );
      return;
    }

    if (data[componentId]) {
      const currentNonNulls = countNonNulls(data[componentId]);
      const newNonNulls = countNonNulls(propsInstance);
      if (newNonNulls > currentNonNulls) {
        data[componentId] = propsInstance;
      }
    } else {
      data[componentId] = propsInstance;
    }

    res.send("ok");
  });

  app.post("/export-data", () => {
    const stringified = JSON.stringify(data, null, 2);
    fs.appendFile("data.json", stringified, (err) => {
      if (err) {
        console.error("Failed to export data", err);
      } else {
        console.log("Export successful");
      }
    });
  });

  app.listen(port, () =>
    console.log(`react-storystrap server listening on port ${port}`)
  );
}
