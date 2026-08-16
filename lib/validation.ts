// ============================================================================
// lib/validation.ts → the rules our forms are checked against
// ============================================================================
// A Zod "schema" is just a written-down list of what counts as valid. React
// Hook Form runs the typed-in values past these rules before we ever call
// Supabase, so obviously-wrong input never leaves the phone.
//
// The wording of each message comes straight from the design.
// ----------------------------------------------------------------------------

import { z } from "zod";

// The design shows this same line under both password boxes on the sign-up
// screen — grey while you are typing, red once it is actually wrong.
export const PASSWORD_HINT = "6-12 Characters";

// LOGIN: we only check the shape of what was typed. Whether the password is
// genuinely right is Supabase's job to answer, not ours.
export const loginSchema = z.object({
  email: z.email({ message: "Incorrect email" }),
  password: z.string().min(1, { message: "Incorrect password" }),
});

// SIGN UP: here we do enforce the password rules, because we are creating the
// account rather than checking one that already exists.
export const signUpSchema = z
  .object({
    email: z.email({ message: "Incorrect email format" }),
    password: z
      .string()
      .min(6, { message: PASSWORD_HINT })
      .max(12, { message: PASSWORD_HINT }),
    confirmPassword: z.string().min(1, { message: PASSWORD_HINT }),
  })
  // A cross-field check: this one compares two boxes instead of looking at one.
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // show it under the second box
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
