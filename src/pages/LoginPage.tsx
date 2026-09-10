import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { OwnerOnlyError, useAuth } from "@/auth/AuthProvider"
import { Button } from "@/components/ui/Button"

function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

export function LoginPage() {
  const { signIn, signInDemo, isDemo } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleSignIn = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await signIn()
      navigate("/")
    } catch (err) {
      setError(
        err instanceof OwnerOnlyError
          ? "This app is restricted to the owner account. Access denied."
          : "Unable to sign in with Google. Please try again.",
      )
      setLoading(false)
    }
  }

  const handleDemoSignIn = async () => {
    setLoading(true)
    setError(null)
    try {
      await signInDemo()
      navigate("/")
    } catch {
      setError("Unable to start demo session. Please refresh and try again.")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-800 text-lg font-semibold text-white">
              CN
            </div>
            <h1 className="text-lg font-semibold text-slate-900">Clinical Notes</h1>
            <p className="mt-1 text-sm text-slate-500">Clinical practice workspace</p>
          </div>

          <form onSubmit={handleGoogleSignIn} className="space-y-4">
            <Button
              type="submit"
              variant="secondary"
              className="w-full"
              loading={loading && !isDemo}
            >
              {!loading && <GoogleIcon />}
              Sign in with Google
            </Button>
          </form>

          {isDemo && (
            <>
              <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs text-slate-400">or</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
              <Button
                variant="primary"
                className="w-full"
                onClick={handleDemoSignIn}
                loading={loading && isDemo}
              >
                Continue with demo account
              </Button>
              <p className="mt-3 text-center text-xs text-slate-400">
                Firebase is not configured for this environment.
              </p>
            </>
          )}

          {error && (
            <p role="alert" className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
        </div>
        <p className="mt-4 text-center text-xs text-slate-400">
          For clinical use only. All information is confidential.
        </p>
      </div>
    </div>
  )
}