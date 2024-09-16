import { PrismaClient } from "@prisma/client";
import { logger } from "../../utils/logger";

const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "event",
      level: "error",
    },
    {
      emit: "event",
      level: "info",
    },
    {
      emit: "event",
      level: "warn",
    },
  ],
});

prisma.$on("query", (e) => {
  logger.info(
    `(Prisma) Query: ${e.query}. Params: ${e.params}. Duration: ${e.duration}ms`
  );
});

prisma.$on("warn", (e) => {
  logger.warn(`(Prisma) ${e.message}`);
});

prisma.$on("info", (e) => {
  logger.info(`(Prisma) ${e.message}`);
});

prisma.$on("error", (e) => {
  logger.error(`(Prisma) ${e.message}`);
});

export { prisma };
