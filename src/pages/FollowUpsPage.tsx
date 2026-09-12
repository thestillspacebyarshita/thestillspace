import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { useData } from "@/contexts/DataContext"
import { Select } from "@/components/ui/Select"
import { FollowUpStatusBadge } from "@/components/ui/StatusBadge"
import { LoadingScreen } from "@/components/LoadingScreen"
import { ErrorState } from "@/components/ErrorState"
import { EmptyState } from "@/components/EmptyState"
import { formatDate } from "@/lib/format"
import { effectiveFollowUpStatus } from "@/lib/followUps"
import type { FollowUp, FollowUpStatus } from "@/types/followup"

type FilterKey = "ALL" | FollowUpStatus

export function FollowUpsPage() {
  const { followUps, clients, sessions, loading, error, reload, updateFollowUp } = useData()
  const [filter, setFilter] = useState<FilterKey>("ALL")
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const clientName = (id: string) => clients.find((c) => c.id === id)?.fullName ?? "Unknown"
  const sessionTitle = (id?: string) => sessions.find((s) => s.id === id)?.title

  const withEffectiveStatus = useMemo(
    () => followUps.map((f) => ({ ...f, displayStatus: effectiveFollowUpStatus(f.status, f.date) })),
    [followUps],
  )

  const filtered = useMemo(() => {
    const statusOrder: Record<FollowUpStatus, number> = {
      Overdue: 0,
      Upcoming: 1,
      Completed: 2,
    }
    return withEffectiveStatus
      .filter((f) => filter === "ALL" || f.displayStatus === filter)
      .sort((a, b) => {
        if (statusOrder[a.displayStatus] !== statusOrder[b.displayStatus]) {
          return statusOrder[a.displayStatus] - statusOrder[b.displayStatus]
        }
        return a.date.localeCompare(b.date)
      })
  }, [withEffectiveStatus, filter])

  if (loading) return <LoadingScreen label="Loading follow-ups…" />
  if (error) return <ErrorState message={error} onRetry={reload} />

  const filterOptions: Array<{ value: FilterKey; label: string }> = [
    { value: "ALL", label: "All statuses" },
    { value: "Upcoming", label: "Upcoming" },
    { value: "Overdue", label: "Overdue" },
    { value: "Completed", label: "Completed" },
  ]

  const setStatus = async (followUp: FollowUp, status: FollowUpStatus) => {
    setStatusMessage(null)
    try {
      await updateFollowUp(followUp.id, {
        clientId: followUp.clientId,
        sessionId: followUp.sessionId,
        date: followUp.date,
        reason: followUp.reason,
        status,
      })
    } catch {
      setStatusMessage("Unable to update the follow-up status. Please try again.")
    }
  }

  const counts = {
    Upcoming: withEffectiveStatus.filter((f) => f.displayStatus === "Upcoming").length,
    Overdue: withEffectiveStatus.filter((f) => f.displayStatus === "Overdue").length,
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Follow-ups</h1>
          <p className="mt-1 text-sm text-slate-500">
            {counts.Upcoming} upcoming · {counts.Overdue} overdue
          </p>
        </div>
        <Select value={filter} onChange={(e) => setFilter(e.target.value as FilterKey)} className="w-40">
          {filterOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </div>

      {statusMessage && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {statusMessage}
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white">
          <EmptyState
            title="No follow-ups"
            description="Follow-ups scheduled from session notes will appear here."
          />
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3 font-medium">Client</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Related Session</th>
                  <th className="px-5 py-3 font-medium">Reason</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((followUp) => {
                  const relatedTitle = sessionTitle(followUp.sessionId)
                  return (
                    <tr key={followUp.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3">
                        <Link
                          to={`/clients/${followUp.clientId}`}
                          className="font-medium text-slate-800 hover:text-slate-600"
                        >
                          {clientName(followUp.clientId)}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-slate-600">{formatDate(followUp.date)}</td>
                      <td className="px-5 py-3">
                        {relatedTitle && followUp.sessionId ? (
                          <Link
                            to={`/sessions/${followUp.sessionId}`}
                            className="text-slate-600 hover:text-slate-800"
                          >
                            {relatedTitle}
                          </Link>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="max-w-xs px-5 py-3 text-slate-600">
                        <span className="line-clamp-2">{followUp.reason ?? "—"}</span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <FollowUpStatusBadge status={followUp.displayStatus} />
                          <Select
                            aria-label="Update status"
                            value={followUp.displayStatus}
                            onChange={(e) => void setStatus(followUp, e.target.value as FollowUpStatus)}
                            className="w-32 px-2 py-1.5"
                          >
                            <option value="Upcoming">Upcoming</option>
                            <option value="Overdue">Overdue</option>
                            <option value="Completed">Completed</option>
                          </Select>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}