import { RequestHandler, Router } from "express";
import passport from "passport";
import { AuthController } from "../controllers/AuthController";
import payloadValidator from "../middlewares/payloadValidator";
import { authLimiter } from "../middlewares/rateLimiter";
import {
  authChangePassPayloadSchema,
  authLoginPayloadSchema,
} from "../schemas/authSchema";

const authRouter = Router();

// Override global rate limiter to more restrictive to prevent brute force
authRouter.use(authLimiter);

// Login
authRouter.post(
  "/auth/login",
  payloadValidator(authLoginPayloadSchema),
  AuthController.login
);

// Refresh Token
authRouter.patch(
  "/auth/refresh-token",
  passport.authenticate("refreshToken", { session: false }) as RequestHandler,
  AuthController.refreshToken
);

// Change Password
authRouter.patch(
  "/auth/change-password",
  passport.authenticate("accessToken", { session: false }) as RequestHandler,
  payloadValidator(authChangePassPayloadSchema),
  AuthController.refreshToken
);

// Logout
authRouter.delete(
  "/auth/logout",
  passport.authenticate("accessToken", { session: false }) as RequestHandler,
  AuthController.logout
);

export default authRouter;
