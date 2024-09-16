import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { validate } from "uuid";
import { prisma } from "../../services/postgres/prismaClient";
import { UserService } from "../../services/postgres/UserService";

describe("User Service", () => {
  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { username: "Test_User3" } });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { username: "Test_User3" } });

    await prisma.$disconnect();
  });

  const user = {
    username: "Test_User3",
    fullName: "Testing user 3",
    email: "test3@example.com",
    password: "Password123$",
  };

  let userId: string;

  const invalidId = "abcdef12345";
  const noOneId = "0191f092-de26-7750-83a2-05602fd1bb43";
  const updateData = { username: "Update_Test_User" };

  it("should create a user - createUser", async () => {
    const createdUser = await UserService.createUser(user);

    expect(createdUser).toHaveProperty("id");
    expect(createdUser).toHaveProperty("username", user.username);
    expect(createdUser).toHaveProperty("fullName", user.fullName);
    expect(createdUser).toHaveProperty("email", user.email);
    expect(createdUser).toHaveProperty("createdAt");
    expect(createdUser).toHaveProperty("updatedAt");
    expect(createdUser).toHaveProperty("Urls");
    expect(createdUser.createdAt).toEqual(createdUser.createdAt);
    expect(validate(createdUser.id)).toBeTruthy();

    userId = createdUser.id;
  });

  it("should throw error if duplicate - createUser", async () => {
    try {
      await UserService.createUser(user);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should get a user - readUser", async () => {
    const foundUser = await UserService.readUser(userId);

    expect(foundUser).toHaveProperty("id", userId);
    expect(foundUser).toHaveProperty("username", user.username);
    expect(foundUser).toHaveProperty("fullName", user.fullName);
    expect(foundUser).toHaveProperty("email", user.email);
    expect(foundUser).toHaveProperty("createdAt");
    expect(foundUser).toHaveProperty("updatedAt");
    expect(foundUser).toHaveProperty("Urls");
    expect(foundUser.createdAt).toEqual(foundUser.createdAt);
    expect(validate(foundUser.id)).toBeTruthy();
  });

  it("should throw error when using invalid user id format - readUser", async () => {
    try {
      await UserService.readUser(invalidId);
    } catch (error) {
      expect(error).toHaveProperty("message", "Invalid user ID format");
      expect(error).toHaveProperty("statusCode", 400);
    }
  });

  it("should throw error when user not found - readUser", async () => {
    try {
      await UserService.readUser(noOneId);
    } catch (error) {
      expect(error).toHaveProperty("message", "User with this ID not found");
      expect(error).toHaveProperty("statusCode", 404);
    }
  });

  it("should update a user - updateUser", async () => {
    const updatedUser = await UserService.updateUser(userId, updateData);

    expect(updatedUser).toHaveProperty("id", userId);
    expect(updatedUser).toHaveProperty("username", updateData.username);
    expect(updatedUser).toHaveProperty("fullName", user.fullName);
    expect(updatedUser).toHaveProperty("email", user.email);
    expect(updatedUser).toHaveProperty("createdAt");
    expect(updatedUser).toHaveProperty("updatedAt");
    expect(updatedUser).toHaveProperty("Urls");
    expect(updatedUser.updatedAt.getTime()).toBeGreaterThan(
      updatedUser.createdAt.getTime()
    );
    expect(validate(updatedUser.id)).toBeTruthy();
  });

  it("should throw error when using invalid user id format - updateUser", async () => {
    try {
      await UserService.updateUser(invalidId, updateData);
    } catch (error) {
      expect(error).toHaveProperty("message", "Invalid user ID format");
      expect(error).toHaveProperty("statusCode", 400);
    }
  });

  it("should throw error when user not found - updateUser", async () => {
    try {
      await UserService.updateUser(noOneId, updateData);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should delete a user - deleteUser", async () => {
    const deletedUser = await UserService.deleteUser(userId);

    expect(deletedUser).toHaveProperty("id", userId);
    expect(deletedUser).toHaveProperty("username", updateData.username);
    expect(deletedUser).toHaveProperty("fullName", user.fullName);
    expect(deletedUser).toHaveProperty("email", user.email);
    expect(deletedUser).toHaveProperty("createdAt");
    expect(deletedUser).toHaveProperty("updatedAt");
    expect(deletedUser).toHaveProperty("Urls");
    expect(deletedUser.updatedAt.getTime()).toBeGreaterThan(
      deletedUser.createdAt.getTime()
    );
    expect(validate(deletedUser.id)).toBeTruthy();
  });

  it("should throw error when user not found - deleteUser", async () => {
    try {
      await UserService.deleteUser(noOneId);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should throw error when using invalid user id format - deleteUser", async () => {
    try {
      await UserService.deleteUser(invalidId);
    } catch (error) {
      expect(error).toHaveProperty("message", "Invalid user ID format");
      expect(error).toHaveProperty("statusCode", 400);
    }
  });
});
