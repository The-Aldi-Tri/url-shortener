import jwt from "jsonwebtoken";
import { secrets } from "../configs/secrets";

export const generateAccessToken = (
  payload: object,
  secret = secrets.jwt.accessTokenSecret,
  expire = secrets.jwt.accessTokenExpiration
) => {
  return jwt.sign(payload, secret, {
    expiresIn: expire,
    jwtid: `${Math.random()}`, // unique identifier to prevent generating same jwt tokens in one second
  });
};

export const generateRefreshToken = (
  payload: object,
  secret = secrets.jwt.refreshTokenSecret,
  expire = secrets.jwt.refreshTokenExpiration
) => {
  return jwt.sign(payload, secret, {
    expiresIn: expire,
    jwtid: `${Math.random()}`,
  });
};
