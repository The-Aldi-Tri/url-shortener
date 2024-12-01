import { z } from "zod";
import { AtLeastOne } from "../utils/atLeastOne";

// export const urlPayloadSchema = z.object({
//   originalUrl: z
//     .string()
//     .regex(
//       /[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/i,
//       "format are not valid."
//     ),
//   shortUrl: z
//     .string()
//     .regex(
//       /^\w+$/,
//       "should only contain word characters (letters, digits, and underscores)"
//     ),
// });

export const urlPayloadSchema = z.object({
  originalUrl: z
    .string()
    .min(11)
    .max(1000)
    .refine((url) => {
      try {
        const newUrl = new URL(url);
        return newUrl.protocol === "http:" || newUrl.protocol === "https:";
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        return false;
      }
    }, "should be valid URL"),
  shortUrl: z
    .string()
    .min(3)
    .max(256)
    .regex(
      /^[a-zA-Z0-9-_.~]+$/,
      "should only contain Alphanumeric Characters: a-z, A-Z, 0-9 and Special Characters: -, _, ., ~"
    ),
});

export type urlPostPayloadType = z.infer<typeof urlPayloadSchema>;

export type urlPatchPayloadType = AtLeastOne<urlPostPayloadType>;
