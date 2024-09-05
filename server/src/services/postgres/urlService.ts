import { url } from "inspector";
import { validate } from "uuid";
import { z } from "zod";
import urlsPayloadSchema from "../../schemas/urlSchema";
import prisma from "../prismaClient";

type url = z.infer<typeof urlsPayloadSchema>;

export const addUrl = async (userId: string, urlData: url) => {
  if (!validate(userId)) return "Invalid user ID format";

  const existingUrl = await prisma.url.findUnique({
    where: {
      shortUrl: urlData.shortUrl,
    },
  });
  if (existingUrl) return "Url with this shortUrl already exists";

  const newUrl = await prisma.url.create({
    data: {
      userId,
      ...urlData,
    },
  });

  return newUrl;
};

export const getOriginalUrl = async (shortUrl: string) => {
  return await prisma.url.findUnique({ where: { shortUrl } });
};

export const updateUrl = async (
  userId: string,
  oldShortUrl: string,
  updateData: url
) => {
  if (!validate(userId)) return "Invalid user ID format";

  const foundUrl = await prisma.url.findUnique({
    where: { shortUrl: oldShortUrl },
  });
  if (!foundUrl) return "Url not found";

  const accessUrl = await prisma.url.findUnique({
    where: { shortUrl: oldShortUrl, userId },
  });
  if (!accessUrl) return "This user does not have access to this Url";

  const urlEdited = await prisma.url.update({
    where: { shortUrl: oldShortUrl },
    data: updateData,
  });
  return urlEdited;
};

export const deleteUrl = async (userId: string, shortUrl: string) => {
  if (!validate(userId)) return "Invalid user ID format";

  const urlFound = await prisma.url.findUnique({
    where: { shortUrl },
  });
  if (!urlFound) return "url not found";

  const accessUrl = await prisma.url.findUnique({
    where: { shortUrl, userId },
  });
  if (!accessUrl) return "This user does not have access to this Url";

  const urlDeleted = await prisma.url.delete({
    where: { shortUrl },
  });

  return urlDeleted;
};
