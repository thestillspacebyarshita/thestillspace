import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth"
import { getAuthInstance } from "@/firebase/auth"

/**
 * Authentication service abstraction over Firebase Auth.
 *
 * The UI should consume this through the AuthProvider context (useAuth) rather
 * than importing Firebase directly.
 */
export const authService = {
  async signInWithGoogle(): Promise<User> {
    const auth = getAuthInstance()
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    return result.user
  },

  async signOut(): Promise<void> {
    const auth = getAuthInstance()
    await signOut(auth)
  },

  getCurrentUser(): User | null {
    const auth = getAuthInstance()
    return auth.currentUser
  },

  subscribeToAuthState(callback: (user: User | null) => void): () => void {
    const auth = getAuthInstance()
    return onAuthStateChanged(auth, callback)
  },
}
