import { describe, expect, it } from "@jest/globals";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateToken";

describe("Token Generation Functions", () => {
  it("Should generate tokens, can be decoded using correct secret, and the decoded token contain correct payload", () => {
    const payload = { userId: 1 };

    const accessTokenSecret = "accessToken";
    const accessTokenExpiration = 900; // 15 minutes

    const iatAT = Math.floor(Date.now() / 1000);
    const expAT = Math.floor(Date.now() / 1000) + accessTokenExpiration;

    const accessToken = generateAccessToken(
      payload,
      accessTokenSecret,
      accessTokenExpiration
    );

    const decodedAccessToken = jwt.verify(
      accessToken,
      accessTokenSecret
    ) as jwt.JwtPayload;

    expect(decodedAccessToken).toMatchObject(payload);
    expect(decodedAccessToken.exp).toBeGreaterThanOrEqual(expAT);
    expect(decodedAccessToken.exp).toBeLessThanOrEqual(expAT + 1);
    expect(decodedAccessToken.iat).toBeGreaterThanOrEqual(iatAT);
    expect(decodedAccessToken.iat).toBeLessThanOrEqual(iatAT + 1);

    const refreshTokenSecret = "refreshToken";
    const refreshTokenExpiration = 259200; // 3 days

    const iatRT = Math.floor(Date.now() / 1000);
    const expRT = Math.floor(Date.now() / 1000) + refreshTokenExpiration;

    const refreshToken = generateRefreshToken(
      payload,
      refreshTokenSecret,
      refreshTokenExpiration
    );

    const decodedRefreshToken = jwt.verify(
      refreshToken,
      refreshTokenSecret
    ) as jwt.JwtPayload;

    expect(decodedRefreshToken).toMatchObject(payload);
    expect(decodedRefreshToken.exp).toBeGreaterThanOrEqual(expRT);
    expect(decodedRefreshToken.exp).toBeLessThanOrEqual(expRT + 1);
    expect(decodedRefreshToken.iat).toBeGreaterThanOrEqual(iatRT);
    expect(decodedRefreshToken.iat).toBeLessThanOrEqual(iatRT + 1);
  });

  it("should generate different tokens even within one second", () => {
    const accessTokens: string[] = [];
    const refreshTokens: string[] = [];
    const payload = { userId: 1 };

    for (let i = 0; i < 1000; i++) {
      accessTokens.push(generateAccessToken(payload));
      refreshTokens.push(generateRefreshToken(payload));
    }

    expect(new Set(accessTokens).size).toEqual(accessTokens.length);
    expect(new Set(refreshTokens).size).toEqual(refreshTokens.length);
  });
});
