import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextFunction, Request, Response } from "express";
import { CustomError } from "../exceptions/customError";

// DON'T FORGET!!!
// Error middleware NEED exactly or at least 4 params: error, req, res, next
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
        message: "User with this username or email already exists",
      });
    }
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Record not found",
        message: "User with this ID not found",
      });
    }
  }
  if (error instanceof CustomError) {
    return res.status(error.statusCode).json({ error: error.message });
  }
  return res.status(500).json({ error: "An unexpected error occurred." });
};
