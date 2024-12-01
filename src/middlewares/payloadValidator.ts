import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";

const payloadValidator = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map(
          (issue) => `${issue.path[0]} ${issue.message}`
        );

        return res.status(422).json({ "validation error": errors });
      }
      next(error);
    }
  };
};

export default payloadValidator;
