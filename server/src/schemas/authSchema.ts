import { z } from "zod";
import { userPayloadSchema } from "./userSchema";

export const authLoginPayloadSchema = z.union([
  userPayloadSchema.pick({ username: true, password: true }),
  userPayloadSchema.pick({ email: true, password: true }),
]);

export type authLoginPayloadType = z.infer<typeof authLoginPayloadSchema>;

export const authChangePassPayloadSchema = z.object({
  oldPass: userPayloadSchema.shape.password,
  newPass: userPayloadSchema.shape.password,
});

export type authChangePassPayloadType = z.infer<
  typeof authChangePassPayloadSchema
>;
