import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/customError";
import { logger } from "../utils/logger";

// DON'T FORGET!!!
// Error middleware NEED exactly 4 params: error, req, res, next
export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction // eslint-disable-line @typescript-eslint/no-unused-vars
) => {
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code == "P2002") {
      return res.status(409).json({
        error: "Duplicate Record",
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Record not found",
      });
    }
  }

  if (error instanceof CustomError) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  logger.error("Unhandled error: ", error);
  return res.status(500).json({ error: "An unexpected error occurred." });
};
