import { NextFunction, Request, Response } from "express";

const asyncWrapper = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err: unknown) => next(err));
  };
};

export default asyncWrapper;
