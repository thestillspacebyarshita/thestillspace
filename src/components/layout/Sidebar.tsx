import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "@/auth/AuthProvider"

const navItems = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/clients", label: "Clients" },
  { to: "/sessions", label: "Sessions" },
  { to: "/follow-ups", label: "Follow-ups" },
]

interface SidebarProps {
  open: boolean
  onNavigate: () => void
}

function NavIcon({ label }: { label: string }) {
  const initials = label
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded text-[10px] font-semibold">
      {initials}
    </span>
  )
}

export function Sidebar({ open, onNavigate }: SidebarProps) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate("/login")
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={onNavigate}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center border-b border-slate-200 px-5">
          <span
            className="text-base font-semibold tracking-tight text-slate-900"
            role="button"
            onClick={onNavigate}
          >
            Clinical Notes
          </span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Main">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <NavIcon label={item.label} />
              {item.label}
            </NavLink>
          ))}

          <div className="pt-4">
            <NavLink
              to="/settings"
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <NavIcon label="Settings" />
              Settings
            </NavLink>
          </div>
        </nav>

        {user && (
          <div className="border-t border-slate-200 px-4 py-3">
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt=""
                  className="h-8 w-8 rounded-full"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
                  {(user.displayName ?? user.email ?? "?")[0]?.toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800">
                  {user.displayName ?? "Clinician"}
                </p>
                {user.email && (
                  <p className="truncate text-xs text-slate-500">{user.email}</p>
                )}
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                title="Sign out"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
