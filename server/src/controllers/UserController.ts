import { NextFunction, Request, Response } from "express";
import { userType } from "../schemas/userSchema";
import { UserService } from "../services/postgres/UserService";
import { AtLeastOne } from "../utils/atLeastOne";

export class UserController {
  static addUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await UserService.createUser(req.body as userType);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  static getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await UserService.readUser(req.params.userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  static updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await UserService.updateUser(
        req.params.userId,
        req.body as AtLeastOne<Omit<userType, "password">>
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  static deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await UserService.deleteUser(req.params.userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
