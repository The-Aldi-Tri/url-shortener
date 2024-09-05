import { Request, Response } from "express";

export const unknownRouteHandler = (req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
};
