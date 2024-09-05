import { z } from "zod";

export const urlsPayloadSchema = z.object({
  originalUrl: z
    .string()
    .regex(
      /[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/i,
      "format are not valid."
    ),
  shortUrl: z
    .string()
    .regex(
      /^\w+$/,
      "should only contain word characters (letters, digits, and underscores)"
    ),
});

export type urlType = z.infer<typeof urlsPayloadSchema>;
