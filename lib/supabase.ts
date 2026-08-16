// ============================================================================
// lib/supabase.ts → our ONE connection to Supabase
// ============================================================================
// Supabase is a free online service that stores our users and checks their
// passwords for us. This file creates a "client" — think of it as a phone line
// the whole app shares to talk to Supabase.
//
// On a phone there is no browser to remember the login, so we hand Supabase
// AsyncStorage (the phone's own little storage). That is what keeps you signed
// in after you close and reopen the app.
//
// The two values come from your .env file. We never type real keys in code.
// ----------------------------------------------------------------------------

import "react-native-url-polyfill/auto";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// On web we build static HTML up front, and that render happens in Node —
// where there is no browser and no `window`. AsyncStorage's web version reaches
// straight for window.localStorage, so it explodes there. During that render
// nobody is logged in anyway, so we hand Supabase a storage that politely
// answers "nothing saved" instead. Real devices and real browsers both have
// `window`, so they get the real AsyncStorage.
const isServer = typeof window === "undefined";

const noopStorage = {
  getItem: async () => null,
  setItem: async () => {},
  removeItem: async () => {},
};

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!, // your project's web address
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, // your project's public key
  {
    auth: {
      storage: isServer ? noopStorage : AsyncStorage, // save the session on the device
      autoRefreshToken: !isServer, // keep the login fresh in the background
      persistSession: !isServer, // remember me after the app is closed
      // On a phone the provider hands the session back through a deep link, so
      // there is no URL for Supabase to read and we do the swap by hand.
      // In a browser it IS a website: the provider sends us back to our own
      // address with a one-time ?code= on the end, and this lets Supabase spot
      // it and trade it for a session automatically.
      detectSessionInUrl: !isServer && Platform.OS === "web",
    },
  }
);