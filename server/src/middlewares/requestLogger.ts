import { NextFunction, Request, Response } from "express";
import { v7 as UUIDv7 } from "uuid";
import { logger } from "../utils/logger";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const reqId = UUIDv7();
  const start = Date.now();
  const { method, url, ip, headers } = req;

  logger.info(
    `Incoming request (${reqId}): ${method} ${url} ${ip} ${headers["user-agent"]}`
  );

  res.on("finish", () => {
    logger.info(
      `Returning response (${reqId}): ${res.statusCode} ${Date.now() - start}ms`
    );
  });

  next();
};
