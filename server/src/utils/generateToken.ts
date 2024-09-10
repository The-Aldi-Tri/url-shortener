import jwt from "jsonwebtoken";
import secrets from "../configs/secrets";

export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, secrets.jwt.accessTokenSecret, {
    expiresIn: secrets.jwt.accessTokenExpiration,
  });
};

export const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, secrets.jwt.refreshTokenSecret, {
    expiresIn: secrets.jwt.refreshTokenExpiration,
  });
};
