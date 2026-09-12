import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { authService } from "@/services/authService"

export interface AuthUser {
  uid: string
  displayName: string | null
  email: string | null
  photoURL: string | null
}

interface MockSessionUser {
  uid: string
  displayName: string
  email: string
}

interface AuthContextValue {
  user: AuthUser | null
  initializing: boolean
  isDemo: boolean
  signIn: () => Promise<void>
  signInDemo: () => Promise<void>
  signOut: () => Promise<void>
}

const DEMO_STORAGE_KEY = "sessionnotes_demo_user"

const ownerEmailRaw = import.meta.env.VITE_OWNER_EMAIL as string | undefined
const OWNER_EMAILS = (ownerEmailRaw ?? "")
  .split(",")
  .map((email: string) => email.trim().toLowerCase())
  .filter((email: string) => email.length > 0)

export class OwnerOnlyError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "OwnerOnlyError"
  }
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function isFirebaseConfigured(): boolean {
  return Boolean(import.meta.env.VITE_FIREBASE_API_KEY)
}

function isOwner(user: { email: string | null }): boolean {
  if (OWNER_EMAILS.length === 0 || !user.email) return false
  return OWNER_EMAILS.includes(user.email.toLowerCase())
}

function readDemoUser(): AuthUser | null {
  const raw = sessionStorage.getItem(DEMO_STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as MockSessionUser
    return {
      uid: parsed.uid,
      displayName: parsed.displayName,
      email: parsed.email,
      photoURL: null,
    }
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readDemoUser())
  const [initializing, setInitializing] = useState(true)
  const isDemo = !isFirebaseConfigured()

  useEffect(() => {
    if (isDemo) {
      setInitializing(false)
      return
    }

    const unsubscribe = authService.subscribeToAuthState((firebaseUser) => {
      if (firebaseUser && !isOwner(firebaseUser)) {
        void authService.signOut()
        setUser(null)
      } else {
        setUser(
          firebaseUser
            ? {
                uid: firebaseUser.uid,
                displayName: firebaseUser.displayName,
                email: firebaseUser.email,
                photoURL: firebaseUser.photoURL,
              }
            : null,
        )
      }
      setInitializing(false)
    })

    return unsubscribe
  }, [isDemo])

  const signIn = useCallback(async () => {
    if (isDemo) {
      throw new Error(
        "Firebase is not configured. Configure environment variables, or use demo sign-in.",
      )
    }
    const firebaseUser = await authService.signInWithGoogle()
    if (!isOwner(firebaseUser)) {
      await authService.signOut()
      throw new OwnerOnlyError(
        "This app is restricted to the owner account. Access denied.",
      )
    }
    setUser({
      uid: firebaseUser.uid,
      displayName: firebaseUser.displayName,
      email: firebaseUser.email,
      photoURL: firebaseUser.photoURL,
    })
  }, [isDemo])

  const signInDemo = useCallback(async () => {
    const demoUser: MockSessionUser = {
      uid: "demo-clinician",
      displayName: "Demo Clinician",
      email: "demo@local",
    }
    sessionStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoUser))
    setUser({
      uid: demoUser.uid,
      displayName: demoUser.displayName,
      email: demoUser.email,
      photoURL: null,
    })
  }, [])

  const signOut = useCallback(async () => {
    if (!isDemo) {
      await authService.signOut()
    }
    sessionStorage.removeItem(DEMO_STORAGE_KEY)
    setUser(null)
  }, [isDemo])

  const value = useMemo<AuthContextValue>(
    () => ({ user, initializing, isDemo, signIn, signInDemo, signOut }),
    [user, initializing, isDemo, signIn, signInDemo, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
