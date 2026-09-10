import { getAuth, type Auth } from "firebase/auth"
import { getFirebaseApp } from "./config"

let authInstance: Auth | null = null

/**
 * Returns a singleton Auth instance, initializing it lazily from the shared
 * Firebase app. Importing this does not connect to Firebase until called.
 */
export function getAuthInstance(): Auth {
  if (!authInstance) {
    authInstance = getAuth(getFirebaseApp())
  }
  return authInstance
}
