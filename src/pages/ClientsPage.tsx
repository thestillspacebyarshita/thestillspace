import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { useData } from "@/contexts/DataContext"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Field"
import { Select } from "@/components/ui/Select"
import { ClientStatusBadge } from "@/components/ui/StatusBadge"
import { LoadingScreen } from "@/components/LoadingScreen"
import { ErrorState } from "@/components/ErrorState"
import { EmptyState } from "@/components/EmptyState"
import { calculateAge, formatDate } from "@/lib/format"
import { effectiveFollowUpStatus } from "@/lib/followUps"

type SortKey = "name" | "dateAdded" | "code"

const statusOptions: Array<{ value: string; label: string }> = [
  { value: "ALL", label: "All statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "DISCHARGED", label: "Discharged" },
  { value: "ARCHIVED", label: "Archived" },
]

const sortOptions: Array<{ value: SortKey; label: string }> = [
  { value: "dateAdded", label: "Date added" },
  { value: "name", label: "Name" },
  { value: "code", label: "Client code" },
]

export function ClientsPage() {
  const { clients, sessions, followUps, loading, error, reload } = useData()
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("ALL")
  const [sortKey, setSortKey] = useState<SortKey>("dateAdded")

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const results = clients.filter((client) => {
      const matchesStatus = status === "ALL" || client.status === status
      const matchesQuery =
        !normalized ||
        client.fullName.toLowerCase().includes(normalized) ||
        client.code.toLowerCase().includes(normalized) ||
        (client.preferredName ?? "").toLowerCase().includes(normalized)
      return matchesStatus && matchesQuery
    })

    return results.sort((a, b) => {
      if (sortKey === "name") return a.fullName.localeCompare(b.fullName)
      if (sortKey === "code") return a.code.localeCompare(b.code)
      return b.dateAdded.localeCompare(a.dateAdded)
    })
  }, [clients, query, status, sortKey])

  const mostRecentSessionDate = (clientId: string): string | null => {
    const sorted = sessions
      .filter((s) => s.clientId === clientId)
      .sort((a, b) => b.date.localeCompare(a.date))
    return sorted[0]?.date ?? null
  }

  const nextFollowUpDate = (clientId: string): string | null => {
    const upcoming = followUps
      .filter(
        (f) => f.clientId === clientId && effectiveFollowUpStatus(f.status, f.date) === "Upcoming",
      )
      .sort((a, b) => a.date.localeCompare(b.date))
    return upcoming[0]?.date ?? null
  }

  if (loading) return <LoadingScreen label="Loading clients…" />
  if (error) return <ErrorState message={error} onRetry={reload} />

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Clients</h1>
          <p className="mt-1 text-sm text-slate-500">{filtered.length} clients</p>
        </div>
        <Link to="/clients/new">
          <Button>Add Client</Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="min-w-48 flex-1">
          <Input
            placeholder="Search by name or client code…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search clients"
          />
        </div>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Filter by status"
          className="w-40"
        >
          {statusOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
        <Select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          aria-label="Sort clients"
          className="w-40"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              Sort: {o.label}
            </option>
          ))}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white">
          <EmptyState
            title={clients.length === 0 ? "No clients yet" : "No clients found"}
            description={
              clients.length === 0
                ? "Add your first client to get started."
                : "Try adjusting your search or filters."
            }
            action={
              clients.length === 0 ? (
                <Link to="/clients/new">
                  <Button>Add Client</Button>
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
                  <th className="px-5 py-3 font-medium">Client</th>
                  <th className="px-5 py-3 font-medium">Code</th>
                  <th className="px-5 py-3 font-medium">Age</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Last Session</th>
                  <th className="px-5 py-3 font-medium">Next Follow-up</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <Link
                        to={`/clients/${client.id}`}
                        className="font-medium text-slate-800 hover:text-slate-600"
                      >
                        {client.fullName}
                      </Link>
                      {client.preferredName && (
                        <span className="ml-1.5 text-xs text-slate-400">
                          ({client.preferredName})
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-slate-600">{client.code}</td>
                    <td className="px-5 py-3 text-slate-600">
                      {calculateAge(client.dateOfBirth) ?? "—"}
                    </td>
                    <td className="px-5 py-3">
                      <ClientStatusBadge status={client.status} />
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {formatDate(mostRecentSessionDate(client.id) ?? undefined)}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {formatDate(nextFollowUpDate(client.id) ?? undefined)}
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