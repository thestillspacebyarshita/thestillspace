import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "@/auth/AuthProvider"
import { LoadingScreen } from "@/components/LoadingScreen"

export function PublicOnlyRoute() {
  const { user, initializing } = useAuth()
  const location = useLocation()

  if (initializing) {
    return <LoadingScreen label="Loading…" />
  }

  if (user) {
    const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname
    return <Navigate to={from ?? "/"} replace />
  }

  return <Outlet />
}
