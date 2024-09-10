import { Request, Response } from "express";
import {
  userPatchPayloadType,
  userPostPayloadType,
} from "../schemas/userSchema";
import { UserService } from "../services/postgres/UserService";
import { asyncRouteHandlerWrapper } from "../utils/asyncWrapper";

export class UserController {
  static addUser = asyncRouteHandlerWrapper(
    async (req: Request, res: Response) => {
      const result = await UserService.createUser(
        req.body as userPostPayloadType
      );
      res.status(201).json(result);
    }
  );

  static getUser = asyncRouteHandlerWrapper(
    async (req: Request, res: Response) => {
      const result = await UserService.readUser(req.params.userId);
      res.status(200).json(result);
    }
  );

  static updateUser = asyncRouteHandlerWrapper(
    async (req: Request, res: Response) => {
      const result = await UserService.updateUser(
        req.params.userId,
        req.body as userPatchPayloadType
      );
      res.status(200).json(result);
    }
  );

  static deleteUser = asyncRouteHandlerWrapper(
    async (req: Request, res: Response) => {
      const result = await UserService.deleteUser(req.params.userId);
      res.status(200).json(result);
    }
  );
}
