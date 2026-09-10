import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { useData } from "@/contexts/DataContext"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Field"
import { Select } from "@/components/ui/Select"
import { LoadingScreen } from "@/components/LoadingScreen"
import { ErrorState } from "@/components/ErrorState"
import { EmptyState } from "@/components/EmptyState"
import { formatDate, formatDuration } from "@/lib/format"
import { EVENT_TYPES, type EventType } from "@/types/session"

type SortKey = "date" | "client" | "title"

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

export function SessionsPage() {
  const { sessions, clients, loading, error, reload } = useData()
  const [query, setQuery] = useState("")
  const [eventType, setEventType] = useState("ALL")
  const [dateFilter, setDateFilter] = useState("ALL")
  const [sortKey, setSortKey] = useState<SortKey>("date")

  const clientById = useMemo(() => {
    const map = new Map<string, string>()
    for (const client of clients) map.set(client.id, client.fullName)
    return map
  }, [clients])
  const clientName = (id: string) => clientById.get(id) ?? "Unknown"

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const nameOf = (id: string) => clientById.get(id) ?? "Unknown"
    const results = sessions.filter((session) => {
      const matchesType = eventType === "ALL" || session.eventType === eventType
      const matchesQuery =
        !normalized ||
        session.title.toLowerCase().includes(normalized) ||
        nameOf(session.clientId).toLowerCase().includes(normalized)
      let matchesDate = true
      if (dateFilter === "TODAY") matchesDate = session.date === todayIso()
      if (dateFilter === "WEEK") {
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        matchesDate = session.date >= weekAgo.toISOString().slice(0, 10)
      }
      if (dateFilter === "MONTH") {
        matchesDate = session.date.startsWith(todayIso().slice(0, 7))
      }
      return matchesType && matchesQuery && matchesDate
    })

    return results.sort((a, b) => {
      if (sortKey === "client") return nameOf(a.clientId).localeCompare(nameOf(b.clientId))
      if (sortKey === "title") return a.title.localeCompare(b.title)
      return b.date.localeCompare(a.date)
    })
  }, [sessions, query, eventType, dateFilter, sortKey, clientById])

  if (loading) return <LoadingScreen label="Loading sessions…" />
  if (error) return <ErrorState message={error} onRetry={reload} />

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Sessions</h1>
          <p className="mt-1 text-sm text-slate-500">{filtered.length} sessions</p>
        </div>
        <Link to="/sessions/new">
          <Button>Add Session</Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="min-w-48 flex-1">
          <Input
            placeholder="Search by session title or client…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search sessions"
          />
        </div>
        <Select value={eventType} onChange={(e) => setEventType(e.target.value)} className="w-44">
          <option value="ALL">All event types</option>
          {EVENT_TYPES.map((type: EventType) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>
        <Select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-36">
          <option value="ALL">All dates</option>
          <option value="TODAY">Today</option>
          <option value="WEEK">Last 7 days</option>
          <option value="MONTH">This month</option>
        </Select>
        <Select value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)} className="w-40">
          <option value="date">Sort: Date</option>
          <option value="client">Sort: Client</option>
          <option value="title">Sort: Title</option>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white">
          <EmptyState
            title={sessions.length === 0 ? "No sessions yet" : "No sessions found"}
            description={
              sessions.length === 0
                ? "Record your first session to get started."
                : "Try adjusting your search or filters."
            }
            action={
              sessions.length === 0 ? (
                <Link to="/sessions/new">
                  <Button>Add Session</Button>
                </Link>
              ) : undefined
            }
          />
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Client</th>
                  <th className="px-5 py-3 font-medium">Session</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Time</th>
                  <th className="px-5 py-3 font-medium">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 text-slate-600">{formatDate(session.date)}</td>
                    <td className="px-5 py-3">
                      <Link
                        to={`/clients/${session.clientId}`}
                        className="text-slate-600 hover:text-slate-800"
                      >
                        {clientName(session.clientId)}
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        to={`/sessions/${session.id}`}
                        className="font-medium text-slate-800 hover:text-slate-600"
                      >
                        {session.title}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{session.eventType}</td>
                    <td className="px-5 py-3 text-slate-600">{session.startTime ?? "—"}</td>
                    <td className="px-5 py-3 text-slate-600">
                      {formatDuration(session.durationMinutes)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}