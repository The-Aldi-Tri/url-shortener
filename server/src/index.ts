import { Server } from "http";
import app from "./app";

let server: Server;

const startServer = () => {
  server = app.listen(8080, "127.0.0.1", () => {
    console.info(`Server is listening`);
  });
};

const startApp = () => {
  console.info("Starting up app...");
  startServer();
};

void startApp();

const stopServer = () => {
  return new Promise<void>((resolve, reject) => {
    server.close((err) => {
      if (err) {
        console.error("Error closing server:", err);
        return reject(err);
      }
      console.info("Server closed.");
      resolve();
    });
  });
};

const shutdown = async () => {
  console.info("Received shutdown signal. Closing app gracefully...");
  await stopServer();
};

process.on("SIGINT", () => {
  shutdown()
    .then(() => {
      console.info("Shutdown success.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Unhandled error during shutdown:", error);
      process.exit(1);
    });
});
process.on("SIGTERM", () => {
  shutdown()
    .then(() => {
      console.info("Shutdown success.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Unhandled error during shutdown:", error);
      process.exit(1);
    });
});
