import { Request } from "express";
import passport from "passport";
import {
  ExtractJwt,
  Strategy as JwtStrategy,
  VerifiedCallback,
} from "passport-jwt";
import { AuthService } from "../services/postgres/AuthService";
import secrets from "./secrets";

const accessTokenOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secrets.jwt.accessTokenSecret,
};

const verifyCallback = (
  jwt_payload: Record<string, string>,
  done: VerifiedCallback
) => {
  AuthService.checkUserById(jwt_payload.id)
    .then(function (user) {
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch((error) => done(error, false));
};

passport.use("accessToken", new JwtStrategy(accessTokenOpts, verifyCallback));

const signedCookieExtractor = (req: Request) => {
  let token = null;
  if (req && req.signedCookies) {
    const cookies = req.signedCookies as object;
    if ("refreshToken" in cookies) {
      token = cookies["refreshToken"] as string;
    }
  }
  return token;
};

const refreshTokenOpts = {
  jwtFromRequest: signedCookieExtractor,
  secretOrKey: secrets.jwt.refreshTokenSecret,
};

passport.use("refreshToken", new JwtStrategy(refreshTokenOpts, verifyCallback));
