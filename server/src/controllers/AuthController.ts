import { Request, Response } from "express";
import secrets from "../configs/secrets";
import {
  authChangePassPayloadType,
  authLoginPayloadType,
} from "../schemas/authSchema";
import { AuthService } from "../services/postgres/AuthService";
import { asyncRouteHandlerWrapper } from "../utils/asyncWrapper";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken";

export class AuthController {
  static login = asyncRouteHandlerWrapper(
    async (req: Request, res: Response) => {
      const payload = req.body as authLoginPayloadType;

      let userId;
      if ("email" in payload) {
        userId = await AuthService.loginByEmail(
          payload.email,
          payload.password
        );
      }
      if ("username" in payload) {
        userId = await AuthService.loginByUsername(
          payload.username,
          payload.password
        );
      }

      const accessToken = generateAccessToken({ id: userId });
      const refreshToken = generateRefreshToken({ id: userId });

      res.cookie("refreshToken", refreshToken, {
        signed: true,
        httpOnly: true,
        secure: secrets.node_env === "production",
        sameSite: secrets.node_env === "production" ? "strict" : "none",
        maxAge: secrets.jwt.refreshTokenExpiration * 1000,
      });

      res.status(200).json({ accessToken: accessToken });
    }
  );

  static refreshToken = (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = req.user as Record<string, string>;

    const newAccessToken = generateAccessToken({ id: user.id });

    res.status(200).json({ accessToken: newAccessToken });
  };

  static changePassword = asyncRouteHandlerWrapper(
    async (req: Request, res: Response) => {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const user = req.user as Record<string, string>;
      const passwords = req.body as authChangePassPayloadType;

      await AuthService.changePassword(
        user.id,
        passwords.oldPass,
        passwords.newPass
      );

      res.status(200).json({ message: "Change password success" });
    }
  );

  static logout = (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.clearCookie("refreshToken");

    res.status(200).json({ message: "Logged out successfully" });
  };
}
