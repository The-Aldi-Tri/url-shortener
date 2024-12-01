import { Server } from "http";
import { app } from "./app";
import { secrets } from "./configs/secrets";
import { prisma } from "./services/postgres/prismaClient";
import { asyncCallbackWrapper } from "./utils/asyncWrapper";
import { logger } from "./utils/logger";

logger.info("Starting HTTP server...");
const server = app.listen(
  secrets.app.port,
  secrets.app.host,
  asyncCallbackWrapper(async () => {
    const address = server.address();
    if (typeof address === "string") {
      // UNIX socket case
      logger.info(`Server is listening on ${address}`);
    } else if (address && address.address && address.port) {
      // Network interface case
      logger.info(
        `Server is listening on http://${address.address}:${address.port}`
      );
    } else {
      logger.error("Unable to determine the server address.");
    }

    // Connect the Prisma client
    logger.info("Establishing connections...");
    try {
      await prisma.$connect();
      logger.info("Database connected.");
    } catch (error) {
      logger.error("Error establishing database connection:", error);
    }
  })
);

// Graceful shutdown function
const gracefulShutdown = (signal: NodeJS.Signals, server: Server) => {
  logger.info(`Received ${signal} signal. Closing HTTP server...`);

  // Close the HTTP server
  server.close(
    asyncCallbackWrapper(async () => {
      logger.info("HTTP server closed.");

      // Disconnect the Prisma client
      logger.info("Closing connections...");
      try {
        await prisma.$disconnect();
        logger.info("Database connection closed.");
      } catch (error) {
        logger.error("Error closing database connection:", error);
      }

      // Exit the process
      process.exit(0);
    })
  );

  // Force exit if not closed within 10 seconds
  setTimeout(() => {
    logger.error("Forcing exit after timeout...");
    process.exit(1);
  }, 10000);
};

// Handle termination signals
process.on("SIGINT", () => gracefulShutdown("SIGINT", server));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM", server));
