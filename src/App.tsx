import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { AuthProvider } from "@/auth/AuthProvider"
import { DataRoute } from "@/components/DataRoute"
import { AppLayout } from "@/components/layout/AppLayout"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { PublicOnlyRoute } from "@/components/PublicOnlyRoute"
import { LoginPage } from "@/pages/LoginPage"
import { DashboardPage } from "@/pages/DashboardPage"
import { ClientsPage } from "@/pages/ClientsPage"
import { ClientDetailPage } from "@/pages/ClientDetailPage"
import { ClientFormPage } from "@/pages/ClientFormPage"
import { SessionsPage } from "@/pages/SessionsPage"
import { SessionFormPage } from "@/pages/SessionFormPage"
import { SessionDetailPage } from "@/pages/SessionDetailPage"
import { FollowUpsPage } from "@/pages/FollowUpsPage"
import { SettingsPage } from "@/pages/SettingsPage"
import { SearchPage } from "@/pages/SearchPage"
import { NotFoundPage } from "@/pages/NotFoundPage"

const ROUTER_BASENAME = (() => {
  const src = Array.from(document.querySelectorAll("script[src]"))
    .map((s) => s.getAttribute("src") ?? "")
    .find((s) => s.includes("/assets/"))
  if (!src) return ""
  try {
    const url = new URL(src, window.location.href)
    const idx = url.pathname.lastIndexOf("/assets/")
    return idx > 0 ? url.pathname.slice(0, idx) : ""
  } catch {
    return ""
  }
})()

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={ROUTER_BASENAME}>
        <Routes>
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<DataRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/clients" element={<ClientsPage />} />
                <Route path="/clients/new" element={<ClientFormPage mode="new" />} />
                <Route path="/clients/:clientId" element={<ClientDetailPage />} />
                <Route path="/clients/:clientId/edit" element={<ClientFormPage mode="edit" />} />
                <Route path="/sessions" element={<SessionsPage />} />
                <Route path="/sessions/new" element={<SessionFormPage mode="new" />} />
                <Route path="/sessions/:sessionId" element={<SessionDetailPage />} />
                <Route path="/sessions/:sessionId/edit" element={<SessionFormPage mode="edit" />} />
                <Route path="/follow-ups" element={<FollowUpsPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}