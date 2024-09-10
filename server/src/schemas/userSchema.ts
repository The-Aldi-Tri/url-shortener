import { z } from "zod";
import { AtLeastOne } from "../utils/atLeastOne";

export const userPayloadSchema = z.object({
  username: z
    .string()
    .min(3, "must be at least 3 characters long")
    .max(20, "must be no more than 20 characters long")
    .refine(
      (username) => /^\w+$/.test(username),
      "should only contain word characters (letters, digits, and underscores)"
    )
    .refine(
      (username) => /^[a-zA-Z]{1}/.test(username),
      "should start with alphabet character"
    ),
  fullName: z
    .string()
    .min(3, "must be at least 3 characters long")
    .max(50, "must be no more than 50 characters long")
    .refine(
      (fullName) => /[a-zA-Z. ]/.test(fullName),
      "should contain only letters, dot, and space"
    )
    .refine(
      (fullName) => /^([a-zA-Z]+\.?(?: [a-zA-Z]+\.?)*)$/.test(fullName),
      "should be a valid format. Ex: 'John F. Kennedy'"
    )
    .refine(
      (fullName) => !/\.{2,}/.test(fullName),
      "should not have consecutive dot(.)"
    )
    .refine(
      (fullName) => !/.* {2,}/.test(fullName),
      "should not have consecutive space"
    ),
  email: z.string().email(),
  password: z
    .string()
    .min(8, "must be at least 8 characters long")
    .max(256, "must be no more than 256 characters long")
    .refine(
      (password) => /^[a-zA-Z0-9!@#$%^&]+$/.test(password),
      "should contain only alphanumerics and allowed special characters (!@#$%^&)"
    )
    .refine(
      (password) => /[a-z]/.test(password),
      "must include at least one lowercase letter"
    )
    .refine(
      (password) => /[A-Z]/.test(password),
      "must include at least one uppercase letter"
    )
    .refine(
      (password) => /[!@#$%^&]/.test(password),
      "must include at least one special character (!@#$%^&)"
    ),
});

export type userPostPayloadType = z.infer<typeof userPayloadSchema>;

export type userPatchPayloadType = AtLeastOne<
  Omit<userPostPayloadType, "password">
>;
