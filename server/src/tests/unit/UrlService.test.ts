import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { v7 as generateUUIDv7 } from "uuid";
import { prisma } from "../../services/postgres/prismaClient";
import { UrlService } from "../../services/postgres/UrlService";

describe("Url Service", () => {
  beforeAll(async () => {
    user = await prisma.user.create({
      data: {
        id: generateUUIDv7(),
        username: "Test_User2",
        fullName: "Testing user 2",
        email: "test2@example.com",
        password: await bcrypt.hash("Password123$", 10),
      },
    });
  });

  afterAll(async () => {
    await prisma.url.deleteMany({ where: { shortUrl: url.shortUrl } });
    await prisma.user.deleteMany({ where: { username: "Test_User2" } });

    await prisma.$disconnect();
  });

  let user: User;
  const url = { shortUrl: "google", originalUrl: "http://www.google.com" };

  it("should add an url", async () => {
    const addedUrl = await UrlService.addUrl(user.id, url);

    expect(addedUrl).toHaveProperty("userId", user.id);
    expect(addedUrl).toHaveProperty("shortUrl", url.shortUrl);
    expect(addedUrl).toHaveProperty("originalUrl", url.originalUrl);
    expect(addedUrl).toHaveProperty("createdAt");
    expect(addedUrl).toHaveProperty("updatedAt");
    expect(addedUrl.updatedAt).toEqual(addedUrl.createdAt);
  });

  it("should get original url using short url", async () => {
    const oriUrl = await UrlService.getOriUrl(url.shortUrl);

    expect(oriUrl).toEqual(url.originalUrl);
  });

  const updateData = { originalUrl: "http://www.google.co.id" };

  it("should update an url", async () => {
    const updatedUrl = await UrlService.updateUrl(
      user.id,
      url.shortUrl,
      updateData
    );

    expect(updatedUrl).toHaveProperty("userId", user.id);
    expect(updatedUrl).toHaveProperty("shortUrl", url.shortUrl);
    expect(updatedUrl).toHaveProperty("originalUrl", updateData.originalUrl);
    expect(updatedUrl).toHaveProperty("createdAt");
    expect(updatedUrl).toHaveProperty("updatedAt");
    expect(updatedUrl.updatedAt.getTime()).toBeGreaterThan(
      updatedUrl.createdAt.getTime()
    );
  });

  it("should delete an url", async () => {
    const deletedUrl = await UrlService.deleteUrl(user.id, url.shortUrl);

    expect(deletedUrl).toHaveProperty("userId", user.id);
    expect(deletedUrl).toHaveProperty("shortUrl", url.shortUrl);
    expect(deletedUrl).toHaveProperty("originalUrl", updateData.originalUrl);
    expect(deletedUrl).toHaveProperty("createdAt");
    expect(deletedUrl).toHaveProperty("updatedAt");
    expect(deletedUrl.updatedAt.getTime()).toBeGreaterThan(
      deletedUrl.createdAt.getTime()
    );
  });
});
