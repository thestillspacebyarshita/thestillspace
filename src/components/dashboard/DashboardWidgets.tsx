import { Link } from "react-router-dom"
import { useData } from "@/contexts/DataContext"
import { Card, CardBody, CardHeader } from "@/components/ui/Card"
import { EmptyState } from "@/components/EmptyState"
import { formatDate, formatDuration } from "@/lib/format"
import type { Client, FollowUp, Session } from "@/types"

export function RecentSessions() {
  const { sessions, clients } = useData()

  const clientName = (id: string) => clients.find((c) => c.id === id)?.fullName ?? "Unknown"

  const sorted = [...sessions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)

  if (sorted.length === 0) {
    return (
      <Card>
        <CardHeader title="Recent sessions" />
        <EmptyState
          title="No sessions yet"
          description="Sessions you record will appear here."
        />
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader
        title="Recent sessions"
        actions={
          <Link to="/sessions" className="text-sm font-medium text-slate-500 hover:text-slate-800">
            View all
          </Link>
        }
      />
      <CardBody className="p-0">
        <ul className="divide-y divide-slate-100">
          {sorted.map((session) => (
            <li key={session.id}>
              <Link
                to={`/sessions/${session.id}`}
                className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-slate-50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">{session.title}</p>
                  <p className="truncate text-sm text-slate-500">{clientName(session.clientId)}</p>
                </div>
                <div className="shrink-0 text-right text-sm text-slate-500">
                  <p>{session.eventType}</p>
                  <p>
                    {formatDate(session.date)} · {formatDuration(session.durationMinutes)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  )
}

export function UpcomingFollowUps() {
  const { followUps, clients } = useData()

  const clientName = (id: string) => clients.find((c) => c.id === id)?.fullName ?? "Unknown"

  const upcoming = followUps
    .filter((f: FollowUp) => f.status === "Upcoming")
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5)

  if (upcoming.length === 0) {
    return (
      <Card>
        <CardHeader title="Upcoming follow-ups" />
        <EmptyState title="No upcoming follow-ups" />
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader
        title="Upcoming follow-ups"
        actions={
          <Link
            to="/follow-ups"
            className="text-sm font-medium text-slate-500 hover:text-slate-800"
          >
            View all
          </Link>
        }
      />
      <CardBody className="p-0">
        <ul className="divide-y divide-slate-100">
          {upcoming.map((followUp) => (
            <li key={followUp.id} className="flex items-center justify-between gap-4 px-5 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-800">
                  {clientName(followUp.clientId)}
                </p>
                {followUp.reason && (
                  <p className="truncate text-sm text-slate-500">{followUp.reason}</p>
                )}
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-medium text-slate-700">{formatDate(followUp.date)}</p>
                <p className="text-xs text-slate-400">{followUp.status}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  )
}

export function QuickActions() {
  return (
    <Card>
      <CardHeader title="Quick actions" />
      <CardBody>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/clients/new"
            className="inline-flex items-center gap-2 rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Add Client
          </Link>
          <Link
            to="/sessions/new"
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Add Session
          </Link>
          <Link
            to="/clients"
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Search Clients
          </Link>
        </div>
      </CardBody>
    </Card>
  )
}

export interface ClientRow extends Client {
  mostRecentSession?: Session
  nextFollowUp?: FollowUp
}