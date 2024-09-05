import bcrypt from "bcrypt";
import { v7 as generateUUIDv7, validate as validateUUID } from "uuid";
import { CustomError } from "../../exceptions/customError";
import { userType } from "../../schemas/userSchema";
import { AtLeastOne } from "../../utils/atLeastOne";
import prisma from "../prismaClient";

export class UserService {
  static createUser = async ({
    username,
    fullName,
    email,
    password,
  }: userType) => {
    const newUser = await prisma.user.create({
      data: {
        id: generateUUIDv7(),
        username,
        fullName,
        email,
        password: await bcrypt.hash(password, 10),
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        password: false,
        createdAt: true,
        updatedAt: true,
        Urls: true,
      },
    });

    return newUser;
  };

  static readUser = async (userId: string) => {
    if (!validateUUID(userId)) {
      throw new CustomError(400, "Invalid user ID format");
    }

    const foundUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        password: false,
        createdAt: true,
        updatedAt: true,
        Urls: true,
      },
    });

    if (!foundUser) {
      throw new CustomError(404, "User with this ID not found");
    }

    return foundUser;
  };

  static updateUser = async (
    userId: string,
    updateData: AtLeastOne<userType>
  ) => {
    if (!validateUUID(userId)) {
      throw new CustomError(400, "Invalid user ID format");
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: updateData,
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        password: false,
        createdAt: true,
        updatedAt: true,
        Urls: true,
      },
    });

    return updatedUser;
  };

  static deleteUser = async (userId: string) => {
    if (!validateUUID(userId)) {
      throw new CustomError(400, "Invalid user ID format");
    }

    const deletedUser = await prisma.user.delete({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        password: false,
        createdAt: true,
        updatedAt: true,
        Urls: true,
      },
    });

    return deletedUser;
  };
}
