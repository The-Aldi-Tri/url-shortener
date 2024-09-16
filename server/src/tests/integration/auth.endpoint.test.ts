import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import bcrypt from "bcrypt";
import request from "supertest";
import { v7 as UUIDv7 } from "uuid";
import { app } from "../../app";
import { prisma } from "../../services/postgres/prismaClient";

describe("/api/auth", () => {
  const userData = {
    id: UUIDv7(),
    username: "Test_User5",
    fullName: "Testing user five",
    email: "test5@example.com",
    password: "Password1234$",
  };

  let localAccessToken: string;
  let localCookies: string[];
  const noOneUsername = "not_user";
  const incorrectPassword = "12345abcdeEFG$";

  beforeAll(async () => {
    await prisma.user.createMany({
      data: [
        { ...userData, password: await bcrypt.hash(userData.password, 10) },
      ],
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { username: "Test_User5" } });
    await prisma.$disconnect();
  });

  describe("POST /api/auth/login", () => {
    it("should authenticated a valid user by email", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: userData.email, password: userData.password });

      const cookies = response.headers["set-cookie"] as unknown as string[];

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("accessToken");
      expect(
        cookies.some((cookie) => cookie.startsWith("refreshToken="))
      ).toBeTruthy();
    });
  });

  it("should authenticated a valid user by username", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ username: userData.username, password: userData.password });

    const cookies = response.headers["set-cookie"] as unknown as string[];
    const body = response.body as Record<"accessToken", string>;

    localAccessToken = body.accessToken;
    localCookies = cookies;

    expect(response.status).toBe(200);
    expect(body).toHaveProperty("accessToken");
    expect(
      cookies.some((cookie) => cookie.startsWith("refreshToken="))
    ).toBeTruthy();
  });

  it("should give error when user not found", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ username: noOneUsername, password: userData.password });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      "error",
      "User with this username not found"
    );
  });

  it("should give error when password incorrect", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ username: userData.username, password: incorrectPassword });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error", "Password incorrect");
  });

  describe("GET /api/auth/refresh-token", () => {
    it("should refresh access token", async () => {
      const response = await request(app)
        .get("/api/auth/refresh-token")
        .set("Cookie", [...localCookies]);

      const body = response.body as Record<string, string>;

      expect(response.status).toBe(200);
      expect(body).toHaveProperty("accessToken");
      expect(body.accessToken).not.toBe(localAccessToken);
    });

    it("should not refresh access token when required cookie is not present", async () => {
      const response = await request(app).get("/api/auth/refresh-token");

      expect(response.status).toBe(401);
      expect(response.text).toBe("Unauthorized");
    });
  });

  describe("PATCH /api/auth/change-password", () => {
    it("should change user password", async () => {
      const newPass = "Password1234567$";

      const response = await request(app)
        .patch("/api/auth/change-password")
        .set("Authorization", `Bearer ${localAccessToken}`)
        .send({ oldPass: userData.password, newPass: newPass });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Change password success"
      );

      const response2 = await request(app)
        .patch("/api/auth/change-password")
        .set("Authorization", `Bearer ${localAccessToken}`)
        .send({ oldPass: userData.password, newPass: newPass });

      expect(response2.status).toBe(401);
      expect(response2.body).toHaveProperty("error", "Password incorrect");
    });
  });

  describe("DELETE /api/auth/logout", () => {
    it("should logout a user", async () => {
      const response = await request(app)
        .delete("/api/auth/logout")
        .set("Cookie", [...localCookies])
        .set("Authorization", `Bearer ${localAccessToken}`);

      const cookies = response.headers["set-cookie"] as unknown as string[];

      // Example set cookie header
      /* [ 'refreshToken=s%3AeyJhbGciOiJIUzI1NiI; Max-Age=900; Path=/; Expires=Sun, 15 Sep 2024 07:41:57 GMT; HttpOnly; SameSite=None' ] */
      // When clearing cookie
      /* [ 'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT' ] */

      const definedCookie = cookies.find((cookie) =>
        cookie.startsWith("refreshToken")
      );
      const refreshToken = definedCookie?.split(";")[0].split("=")[1];

      expect(response.status).toBe(200);
      expect(refreshToken).toBeFalsy();
      expect(response.body).toHaveProperty(
        "message",
        "Logged out successfully"
      );
    });
  });
});
