import { validate as validateUUID } from "uuid";
import {
  urlPatchPayloadType,
  urlPostPayloadType,
} from "../../schemas/urlSchema";
import { CustomError } from "../../utils/customError";
import prisma from "./prismaClient";

export class UrlService {
  static addUrl = async (userId: string, urlData: urlPostPayloadType) => {
    if (!validateUUID(userId)) {
      throw new CustomError(400, "Invalid user ID format");
    }

    const newUrl = await prisma.url.create({
      data: {
        userId,
        ...urlData,
      },
    });

    return newUrl;
  };

  static getOriUrl = async (shortUrl: string) => {
    const url = await prisma.url.findUnique({ where: { shortUrl } });

    if (!url) {
      throw new CustomError(404, "URL not found");
    } else {
      return url.originalUrl;
    }
  };

  static updateUrl = async (
    userId: string,
    shortUrl: string,
    updateData: urlPatchPayloadType
  ) => {
    if (!validateUUID(userId)) {
      throw new CustomError(400, "Invalid user ID format");
    }

    const updatedUrl = await prisma.url.update({
      where: { shortUrl, userId },
      data: updateData,
    });

    return updatedUrl;
  };

  static deleteUrl = async (userId: string, shortUrl: string) => {
    if (!validateUUID(userId)) {
      throw new CustomError(400, "Invalid user ID format");
    }

    const deletedUrl = await prisma.url.delete({
      where: { shortUrl, userId },
    });

    return deletedUrl;
  };
}
