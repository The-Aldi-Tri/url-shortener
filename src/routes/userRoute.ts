import { RequestHandler, Router } from "express";
import passport from "passport";
import { UserController } from "../controllers/UserController";
import payloadValidator from "../middlewares/payloadValidator";
import { userPayloadSchema } from "../schemas/userSchema";

const userRouter = Router();

userRouter.post(
  "/users",
  payloadValidator(userPayloadSchema),
  UserController.addUser
);
userRouter.get(
  "/users",
  passport.authenticate("accessToken", { session: false }) as RequestHandler,
  UserController.getUser
);
userRouter.patch(
  "/users",
  passport.authenticate("accessToken", { session: false }) as RequestHandler,
  payloadValidator(userPayloadSchema.omit({ password: true }).partial()),
  UserController.updateUser
);
userRouter.delete(
  "/users",
  passport.authenticate("accessToken", { session: false }) as RequestHandler,
  UserController.deleteUser
);

export default userRouter;
