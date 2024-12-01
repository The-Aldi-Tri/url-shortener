import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { v7 as generateUUIDv7 } from "uuid";
import { AuthService } from "../../services/postgres/AuthService";
import { prisma } from "../../services/postgres/prismaClient";

describe("Auth Service", () => {
  let user: User;

  beforeAll(async () => {
    user = await prisma.user.create({
      data: {
        id: generateUUIDv7(),
        username: "Test_User1",
        fullName: "Testing user 1",
        email: "test1@example.com",
        password: await bcrypt.hash("Password123$", 10),
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { username: "Test_User1" } });

    await prisma.$disconnect();
  });

  it("should login with email and password", async () => {
    const userId = await AuthService.login("email", user.email, "Password123$");

    expect(userId).toEqual(user.id);
  });

  it("should login with username and password", async () => {
    const userId = await AuthService.login(
      "username",
      user.username,
      "Password123$"
    );

    expect(userId).toEqual(user.id);
  });

  it("should change user password", async () => {
    try {
      await AuthService.changePassword(
        user.id,
        "Password123$",
        "Password12345$"
      );

      await AuthService.changePassword(
        user.id,
        "Password12345$",
        "Password123$"
      );
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it("should check a user by its id", async () => {
    const checkedUser = await AuthService.checkUserById(user.id);

    expect(checkedUser?.id).toEqual(user.id);
  });
});
