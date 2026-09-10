import { Link } from "react-router-dom"
import { useData } from "@/contexts/DataContext"
import { Card, CardBody, CardHeader } from "@/components/ui/Card"
import { EmptyState } from "@/components/EmptyState"
import { formatDate, formatDuration } from "@/lib/format"
import type { Session } from "@/types/session"

function TimelineItem({
  session,
  isLast,
  isFirst,
  date,
}: {
  session: Session
  isLast?: boolean
  isFirst?: boolean
  date?: string
}) {
  return (
    <li className="relative flex gap-4 pb-8 last:pb-0">
      <div className="flex flex-col items-center">
        <span
          className={`mt-1.5 h-3 w-3 rounded-full ${isFirst ? "bg-slate-700" : "bg-slate-300"}`}
        />
        {!isLast && <span className="mt-1 w-px flex-1 bg-slate-200" />}
      </div>
      <div className="min-w-0 flex-1 pb-1">
        {date && (
          <p className="text-sm font-medium text-slate-900">{formatDate(date)}</p>
        )}
        <Link
          to={`/sessions/${session.id}`}
          className="group mt-0.5 block rounded-md border border-slate-200 bg-white px-4 py-3 transition-colors hover:border-slate-300 hover:bg-slate-50"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-800 group-hover:text-slate-600">
              {session.title}
            </p>
            <p className="text-xs text-slate-500">
              {formatDuration(session.durationMinutes)}
              {session.startTime ? ` · ${session.startTime}` : ""}
            </p>
          </div>
          <p className="mt-0.5 text-sm text-slate-500">{session.eventType}</p>
        </Link>
      </div>
    </li>
  )
}

export function ClientTimeline({ clientId }: { clientId: string }) {
  const { sessions } = useData()

  const clientSessions = sessions
    .filter((s) => s.clientId === clientId)
    .sort((a, b) => b.date.localeCompare(a.date))

  if (clientSessions.length === 0) {
    return (
      <Card>
        <CardHeader
          title="Clinical timeline"
          actions={
            <Link
              to={`/sessions/new?client=${clientId}`}
              className="text-sm font-medium text-slate-500 hover:text-slate-800"
            >
              Add session
            </Link>
          }
        />
        <EmptyState
          title="No sessions recorded"
          description="Session history for this client will appear here."
        />
      </Card>
    )
  }

  // Group sessions by date so the timeline reads naturally.
  const groups = new Map<string, Session[]>()
  for (const session of clientSessions) {
    const list = groups.get(session.date) ?? []
    list.push(session)
    groups.set(session.date, list)
  }
  const dates = [...groups.keys()].sort((a, b) => b.localeCompare(a))

  const items = dates.flatMap((date) =>
    (groups.get(date) ?? []).map((session) => ({ session, date })),
  )

  return (
    <Card>
      <CardHeader
        title="Clinical timeline"
        actions={
          <Link
            to={`/sessions/new?client=${clientId}`}
            className="text-sm font-medium text-slate-500 hover:text-slate-800"
          >
            Add session
          </Link>
        }
      />
      <CardBody>
        <ol>
          {items.map(({ session, date }, itemIndex) => (
            <TimelineItem
              key={session.id}
              session={session}
              date={date}
              isFirst={itemIndex === 0}
              isLast={itemIndex === items.length - 1}
            />
          ))}
        </ol>
      </CardBody>
    </Card>
  )
}