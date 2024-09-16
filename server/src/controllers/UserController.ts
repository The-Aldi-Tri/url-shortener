import { Request, Response } from "express";
import {
  userPatchPayloadType,
  userPostPayloadType,
} from "../schemas/userSchema";
import { UserService } from "../services/postgres/UserService";
import { asyncRouteHandlerWrapper } from "../utils/asyncWrapper";

type reqUser = { id: string };

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
      const user = req.user as reqUser;
      const result = await UserService.readUser(user.id);
      res.status(200).json(result);
    }
  );

  static updateUser = asyncRouteHandlerWrapper(
    async (req: Request, res: Response) => {
      const user = req.user as reqUser;
      const result = await UserService.updateUser(
        user.id,
        req.body as userPatchPayloadType
      );
      res.status(200).json(result);
    }
  );

  static deleteUser = asyncRouteHandlerWrapper(
    async (req: Request, res: Response) => {
      const user = req.user as reqUser;
      const result = await UserService.deleteUser(user.id);
      res.status(200).json(result);
    }
  );
}
