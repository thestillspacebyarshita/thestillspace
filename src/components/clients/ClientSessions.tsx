import { Link } from "react-router-dom"
import { useData } from "@/contexts/DataContext"
import { Card, CardBody, CardHeader } from "@/components/ui/Card"
import { EmptyState } from "@/components/EmptyState"
import { formatDate, formatDuration } from "@/lib/format"
import type { Session } from "@/types/session"

export function ClientSessions({ clientId }: { clientId: string }) {
  const { sessions } = useData()

  const clientSessions: Session[] = sessions
    .filter((s) => s.clientId === clientId)
    .sort((a, b) => b.date.localeCompare(a.date))

  if (clientSessions.length === 0) {
    return (
      <Card>
        <CardHeader title="Sessions" />
        <EmptyState title="No sessions yet" description="Record a session to begin the timeline." />
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader title="Sessions" description={`${clientSessions.length} recorded`} />
      <CardBody className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clientSessions.map((session) => (
                <tr key={session.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 text-slate-600">
                    {formatDate(session.date)}
                    {session.startTime ? ` · ${session.startTime}` : ""}
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
                  <td className="px-5 py-3 text-slate-600">
                    {formatDuration(session.durationMinutes)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  )
}