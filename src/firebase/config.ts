import { initializeApp, type FirebaseApp } from "firebase/app"

const REQUIRED_KEYS = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
] as const

function missingKeys(): string[] {
  return REQUIRED_KEYS.filter((key) => !import.meta.env[key])
}

/**
 * Initializes the shared Firebase app from Vite environment variables.
 *
 * Throws a clear, user-friendly error if any required variable is missing so
 * that misconfiguration surfaces early instead of failing mysteriously.
 */
export function getFirebaseApp(): FirebaseApp {
  const missing = missingKeys()

  if (missing.length > 0) {
    const list = missing.join(", ")
    throw new Error(
      `Firebase is not configured. Missing environment variable(s): ${list}. ` +
        `Create a .env file from .env.example and add your Firebase project values.`,
    )
  }

  return initializeApp({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  })
}
