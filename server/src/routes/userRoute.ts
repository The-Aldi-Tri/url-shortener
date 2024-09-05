/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import { UserController } from "../controllers/UserController";
import payloadValidator from "../middlewares/payloadValidator";
import { userPayloadSchema } from "../schemas/userSchema";

const userRouter = Router();

userRouter.post(
  "/users",
  payloadValidator(userPayloadSchema),
  UserController.addUser
);
userRouter.get("/users/:userId", UserController.getUser);
userRouter.patch(
  "/users/:userId",
  payloadValidator(userPayloadSchema.omit({ password: true }).partial()),
  UserController.updateUser
);
userRouter.delete("/users/:userId", UserController.deleteUser);

export default userRouter;
