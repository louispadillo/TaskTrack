// ============================================================================
// lib/authErrors.ts → turning Supabase's errors into sentences people can read
// ============================================================================
// Supabase hands back errors like `invalid_credentials`. Showing that to a user
// is useless, and showing "Wrong email or password" for EVERY failure is worse
// than useless — it blames the user for what might be a dead wifi connection.
//
// So we sort each error into one of two buckets:
//   • `field`   — the box on screen this belongs under, if any
//   • `message` — what to actually say
// ----------------------------------------------------------------------------

import type { AuthError } from "@supabase/supabase-js";
import { PASSWORD_HINT } from "./validation";

export type AuthField = "email" | "password" | null;

export type FriendlyAuthError = {
  field: AuthField; // null → show it as a general message, not under a box
  message: string;
};

// A lost connection surfaces in a few different shapes depending on platform,
// so we sniff for all of them rather than trusting one.
function isNetworkError(error: AuthError): boolean {
  return (
    error.name === "AuthRetryableFetchError" ||
    error.code === "network_error" ||
    error.status === 0 ||
    error.status === undefined ||
    /network|fetch|failed to fetch/i.test(error.message)
  );
}

export function describeAuthError(error: AuthError): FriendlyAuthError {
  // Checked first: a network failure can masquerade as almost anything else.
  if (isNetworkError(error)) {
    return {
      field: null,
      message: "Can't reach the server. Check your connection and try again.",
    };
  }

  switch (error.code) {
    // The password really was wrong. The design puts this under the password box.
    case "invalid_credentials":
      return { field: "password", message: "Incorrect password" };

    case "email_not_confirmed":
      return {
        field: null,
        message: "Confirm your email address first — check your inbox.",
      };

    case "user_already_exists":
    case "email_exists":
      return {
        field: "email",
        message: "An account with this email already exists.",
      };

    // Supabase enforces its own password policy on top of ours.
    case "weak_password":
      return { field: "password", message: PASSWORD_HINT };

    case "validation_failed":
      return { field: "email", message: "Incorrect email format" };

    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return {
        field: null,
        message: "Too many attempts. Wait a moment and try again.",
      };

    // Anything we have not specifically planned for: show Supabase's own words
    // rather than inventing a wrong explanation.
    default:
      return { field: null, message: error.message };
  }
}
