import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useData } from "@/contexts/DataContext"
import { NoteBlock } from "@/components/sessions/NoteBlock"
import { Card, CardBody } from "@/components/ui/Card"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { LoadingScreen } from "@/components/LoadingScreen"
import { ErrorState } from "@/components/ErrorState"
import { formatDate, formatDateTime, formatDuration } from "@/lib/format"

export function SessionDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const { sessions, clients, loading, error, reload, deleteSession } = useData()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const session = sessions.find((s) => s.id === sessionId)
  const client = session ? clients.find((c) => c.id === session.clientId) : undefined

  if (loading) return <LoadingScreen label="Loading session…" />
  if (error) return <ErrorState message={error} onRetry={reload} />

  if (!session) {
    return (
      <ErrorState message="This session could not be found." onRetry={() => navigate("/sessions")} />
    )
  }

  const handleDelete = async () => {
    if (!sessionId) return
    setDeleting(true)
    try {
      await deleteSession(sessionId)
      navigate("/sessions")
    } catch {
      setDeleting(false)
    }
  }

  const metaItems: Array<{ label: string; value: string }> = [
    { label: "Date", value: formatDate(session.date) },
    { label: "Time", value: session.startTime ?? "—" },
    { label: "Duration", value: formatDuration(session.durationMinutes) },
    { label: "Event Type", value: session.eventType },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/sessions" className="text-sm text-slate-500 hover:text-slate-800">
            ← Sessions
          </Link>
          <h1 className="mt-1 text-xl font-semibold text-slate-900">{session.title}</h1>
        </div>
        <div className="flex gap-2">
          {client && (
            <Link to={`/clients/${client.id}`}>
              <Button variant="secondary">Back to Client</Button>
            </Link>
          )}
          <Button variant="secondary" onClick={() => navigate(`/sessions/${session.id}/edit`)}>
            Edit
          </Button>
          <Button variant="danger" onClick={() => setConfirmDelete(true)}>
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardBody>
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {metaItems.map((item) => (
              <div key={item.label}>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {item.label}
                </dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-800">{item.value}</dd>
              </div>
            ))}
          </dl>
          {client && (
            <p className="mt-3 text-sm text-slate-600">
              Client:{" "}
              <Link
                to={`/clients/${client.id}`}
                className="font-medium text-slate-800 hover:text-slate-600"
              >
                {client.fullName}
              </Link>{" "}
              <span className="text-slate-400">({client.code})</span>
            </p>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardBody className="space-y-5">
          <NoteBlock label="Session Notes" text={session.sessionNotes} />
          <NoteBlock label="Assessment" text={session.assessment} />
          <NoteBlock label="Interventions" text={session.interventions} />
          <NoteBlock label="Client Response" text={session.clientResponse} />
          <NoteBlock label="Risk Assessment" text={session.riskAssessment} />
          <NoteBlock label="Homework / Tasks" text={session.homework} />
          <NoteBlock label="Plan" text={session.plan} />
          <NoteBlock
            label="Follow-up"
            text={session.followUpDate ? `Scheduled for ${formatDateTime(session.followUpDate)}` : undefined}
          />
        </CardBody>
      </Card>

      <Modal
        open={confirmDelete}
        title="Delete this session?"
        description="This session record and any associated follow-ups will be permanently removed. This action cannot be undone."
        confirmLabel="Delete Session"
        confirmVariant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  )
}