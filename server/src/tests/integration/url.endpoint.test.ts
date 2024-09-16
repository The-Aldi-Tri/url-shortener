import { afterAll, beforeAll, describe, it } from "@jest/globals";
import { Url } from "@prisma/client";
import bcrypt from "bcrypt";
import request from "supertest";
import { v7 as UUIDv7 } from "uuid";
import { app } from "../../app";
import { prisma } from "../../services/postgres/prismaClient";
import { generateAccessToken } from "../../utils/generateToken";

describe("/api/urls", () => {
  const userData = {
    id: UUIDv7(),
    username: "Test_User6",
    fullName: "Testing user six",
    email: "test6@example.com",
    password: "Password1234$",
  };
  let accessToken: string;

  beforeAll(async () => {
    await prisma.user.createMany({
      data: [
        { ...userData, password: await bcrypt.hash(userData.password, 10) },
      ],
    });

    accessToken = generateAccessToken({ id: userData.id });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { username: "Test_User6" } });
    await prisma.$disconnect();
  });

  const urlData = { shortUrl: "google", originalUrl: "https://google.com" };
  const updateData = { originalUrl: "https://google.co.id" };

  describe("POST /api/urls", () => {
    it("should create url", async () => {
      const response = await request(app)
        .post("/api/urls")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(urlData);

      const body = response.body as Record<keyof Url, string>;

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("userId", userData.id);
      expect(response.body).toHaveProperty("shortUrl", urlData.shortUrl);
      expect(response.body).toHaveProperty("originalUrl", urlData.originalUrl);
      expect(response.body).toHaveProperty("createdAt");
      expect(response.body).toHaveProperty("updatedAt");
      expect(body.createdAt).toEqual(body.updatedAt);
    });
  });

  describe("GET /api/urls/:shortUrl", () => {
    it("should get original url", async () => {
      const response = await request(app)
        .get(`/api/urls/${urlData.shortUrl}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(302);
      expect(response.headers).toHaveProperty("location", urlData.originalUrl);
    });
  });

  describe("PATCH /api/urls/:shortUrl", () => {
    it("should update url", async () => {
      const response = await request(app)
        .patch(`/api/urls/${urlData.shortUrl}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send(updateData);

      const body = response.body as Record<keyof Url, string>;

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("userId", userData.id);
      expect(response.body).toHaveProperty("shortUrl", urlData.shortUrl);
      expect(response.body).toHaveProperty(
        "originalUrl",
        updateData.originalUrl
      );
      expect(response.body).toHaveProperty("createdAt");
      expect(response.body).toHaveProperty("updatedAt");
      expect(new Date(body.updatedAt).getTime()).toBeGreaterThan(
        new Date(body.createdAt).getTime()
      );
    });
  });

  describe("DELETE /api/urls/:shortUrl", () => {
    it("should delete url", async () => {
      const response = await request(app)
        .delete(`/api/urls/${urlData.shortUrl}`)
        .set("Authorization", `Bearer ${accessToken}`);

      const body = response.body as Record<keyof Url, string>;

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("userId", userData.id);
      expect(response.body).toHaveProperty("shortUrl", urlData.shortUrl);
      expect(response.body).toHaveProperty(
        "originalUrl",
        updateData.originalUrl
      );
      expect(response.body).toHaveProperty("createdAt");
      expect(response.body).toHaveProperty("updatedAt");
      expect(new Date(body.updatedAt).getTime()).toBeGreaterThan(
        new Date(body.createdAt).getTime()
      );
    });
  });
});
