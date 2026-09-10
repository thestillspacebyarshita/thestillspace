import { useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "@/auth/AuthProvider"
import { Sidebar } from "./Sidebar"

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isDemo } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="flex h-full min-h-screen">
      <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col bg-slate-50">
        <header className="flex h-14 items-center gap-4 border-b border-slate-200 bg-white px-4 lg:px-6">
          <button
            type="button"
            className="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div className="flex flex-1 items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-md px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              Clinical Notes
            </button>

            <div className="hidden min-w-0 flex-1 justify-center sm:flex">
              <form
                role="search"
                className="w-full max-w-sm"
                onSubmit={(e) => {
                  e.preventDefault()
                  const form = e.currentTarget
                  const q = new FormData(form).get("q")?.toString().trim() ?? ""
                  navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/search")
                }}
              >
                <label htmlFor="global-search" className="sr-only">
                  Search
                </label>
                <input
                  id="global-search"
                  name="q"
                  placeholder="Search clients & sessions…"
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none"
                />
              </form>
            </div>
          </div>

          {isDemo && (
            <span className="hidden rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20 sm:inline-flex">
              Demo mode
            </span>
          )}
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
