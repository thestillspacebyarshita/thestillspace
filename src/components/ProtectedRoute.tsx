import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "@/auth/AuthProvider"
import { LoadingScreen } from "@/components/LoadingScreen"

export function ProtectedRoute() {
  const { user, initializing } = useAuth()
  const location = useLocation()

  if (initializing) {
    return <LoadingScreen label="Loading application…" />
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
