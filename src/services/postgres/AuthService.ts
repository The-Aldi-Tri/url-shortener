import bcrypt from "bcrypt";
import { validate as validateUUID } from "uuid";
import { CustomError } from "../../utils/customError";
import { prisma } from "./prismaClient";

export class AuthService {
  static login = async (
    field: "email" | "username",
    identifier: string,
    password: string
  ) => {
    let user: { id: string; password: string } | null = null;
    if (field === "email") {
      user = await prisma.user.findUnique({
        where: { email: identifier },
        select: { id: true, password: true },
      });
    } else if (field === "username") {
      user = await prisma.user.findUnique({
        where: { username: identifier },
        select: { id: true, password: true },
      });
    }

    if (!user) {
      throw new CustomError(404, `User with this ${field} not found`);
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new CustomError(401, "Password incorrect");
    }

    return user.id;
  };

  static changePassword = async (
    userId: string,
    oldPass: string,
    newPass: string
  ) => {
    const oldUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        password: true,
      },
    });

    if (!oldUser) {
      throw new CustomError(404, "User not found");
    }

    const isPassMatch = await bcrypt.compare(oldPass, oldUser.password);
    if (!isPassMatch) {
      throw new CustomError(401, "Password incorrect");
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      select: {
        password: true,
      },
      data: { password: await bcrypt.hash(newPass, 10) },
    });
  };

  static checkUserById = async (userId: string) => {
    if (!validateUUID(userId)) {
      throw new CustomError(400, "Invalid user ID format");
    }
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    });
  };
}
