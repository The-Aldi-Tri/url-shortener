import { Router } from "express";
import fs from "fs";
import path from "path";
import { asyncCallbackWrapper } from "../utils/asyncWrapper";
import logger from "../utils/logger";

const router = Router();

// Define the directory containing route modules
const routesDirectory = path.join(__dirname); // Get the directory name of the current module

// Read all files in the routes directory
fs.readdirSync(routesDirectory).forEach(
  asyncCallbackWrapper(async (file) => {
    // Skip the index file itself to avoid re-importing it
    if (file === "index.ts" || file === "index.js") return;

    // Construct the full path of the current file
    const filePath = path.join(routesDirectory, file as string);

    try {
      // Dynamically import the module from the file path
      const routeModule = (await import(filePath)) as object;

      // Check if the module has a default export
      if ("default" in routeModule) {
        // Use the router from the default export and mount it on the "/api" path
        router.use("/api", routeModule.default as Router);
      }
    } catch (error) {
      // Log any errors that occur during module import or router mounting
      logger.error(error);
    }
  })
);

export default router;
