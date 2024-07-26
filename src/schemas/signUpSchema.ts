import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(2, "Username must be at least 2 character")
  .max(20, "Username must be no more than 20 character")
  .regex(/^[0-9a-zA-Z_]+$/, "Username must not contain special character");

export const signUpSchema = z.object({
  username: userNameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 character" }),
});
