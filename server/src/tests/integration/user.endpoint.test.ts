import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { User } from "@prisma/client";
import request from "supertest";
import { validate } from "uuid";
import { app } from "../../app";
import { prisma } from "../../services/postgres/prismaClient";
import { generateAccessToken } from "../../utils/generateToken";

describe("/api/users", () => {
  const userData = {
    username: "Test_User4",
    fullName: "Testing user four",
    email: "test4@example.com",
    password: "Password1234$",
  };

  const invalidUserId = "abcde12345";
  const noOneUserId = "0191f0e6-6124-7f05-a190-2158ea691a87";
  const invalidAccessToken = generateAccessToken({ id: invalidUserId });
  const noOneAccessToken = generateAccessToken({ id: noOneUserId });
  let userId: string;
  let accessToken: string;
  const updateData = { fullName: "new full name" };

  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { username: "Test_User4" } });
    await prisma.$disconnect();
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { username: "Test_User4" } });

    await prisma.$disconnect();
  });

  describe("POST /api/users", () => {
    it("should create a user", async () => {
      const response = await request(app).post("/api/users").send(userData);

      const body = response.body as Record<keyof User, string>;

      userId = body.id;
      accessToken = generateAccessToken({ id: body.id });

      expect(response.status).toBe(201);
      expect(body).toHaveProperty("id");
      expect(body).toHaveProperty("username", userData.username);
      expect(body).toHaveProperty("fullName", userData.fullName);
      expect(body).toHaveProperty("email", userData.email);
      expect(body).toHaveProperty("createdAt");
      expect(body).toHaveProperty("updatedAt");
      expect(body).toHaveProperty("Urls");
      expect(body.updatedAt).toEqual(body.createdAt);
      expect(validate(body.id)).toBeTruthy();
    });

    it("should not create duplicate user", async () => {
      const response = await request(app).post("/api/users").send(userData);

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty("error", "Duplicate Record");
    });

    it("should give validation error with invalid data", async () => {
      const response = await request(app).post("/api/users").send({});

      const body = response.body as Record<string, string[]>;

      expect(response.status).toBe(422);
      expect(body).toHaveProperty("validation error");
      expect(body["validation error"].length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("GET /api/users", () => {
    it("should get a user", async () => {
      const response = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${accessToken}`);

      const body = response.body as Record<keyof User, string>;

      expect(response.status).toBe(200);
      expect(body).toHaveProperty("id", userId);
      expect(body).toHaveProperty("username", userData.username);
      expect(body).toHaveProperty("fullName", userData.fullName);
      expect(body).toHaveProperty("email", userData.email);
      expect(body).toHaveProperty("createdAt");
      expect(body).toHaveProperty("updatedAt");
      expect(body).toHaveProperty("Urls");
      expect(validate(body.id)).toBeTruthy();
    });

    it("should give error using invalid user id", async () => {
      const response = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${invalidAccessToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "Invalid user ID format");
    });

    it("should give error when user not found", async () => {
      const response = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${noOneAccessToken}`);

      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.status).toBeLessThan(500);
    });
  });

  describe("PATCH /api/users", () => {
    it("should update user data", async () => {
      const response = await request(app)
        .patch("/api/users")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(updateData);

      const body = response.body as Record<keyof User, string>;

      expect(response.status).toBe(200);
      expect(body).toHaveProperty("id", userId);
      expect(body).toHaveProperty("username", userData.username);
      expect(body).toHaveProperty("fullName", updateData.fullName);
      expect(body).toHaveProperty("email", userData.email);
      expect(body).toHaveProperty("createdAt");
      expect(body).toHaveProperty("updatedAt");
      expect(body).toHaveProperty("Urls");
      expect(new Date(body.updatedAt).getTime()).toBeGreaterThan(
        new Date(body.createdAt).getTime()
      );
      expect(validate(body.id)).toBeTruthy();
    });
  });

  describe("DELETE /api/users", () => {
    it("should delete a user", async () => {
      const response = await request(app)
        .delete("/api/users")
        .set("Authorization", `Bearer ${accessToken}`);

      const body = response.body as Record<keyof User, string>;

      expect(response.status).toBe(200);
      expect(body).toHaveProperty("id", userId);
      expect(body).toHaveProperty("username", userData.username);
      expect(body).toHaveProperty("fullName", updateData.fullName);
      expect(body).toHaveProperty("email", userData.email);
      expect(body).toHaveProperty("createdAt");
      expect(body).toHaveProperty("updatedAt");
      expect(body).toHaveProperty("Urls");
      expect(new Date(body.updatedAt).getTime()).toBeGreaterThan(
        new Date(body.createdAt).getTime()
      );
      expect(validate(body.id)).toBeTruthy();
    });
  });
});
