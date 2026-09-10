import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useData } from "@/contexts/DataContext"
import { ClientHeader } from "@/components/clients/ClientHeader"
import { ClientSummary } from "@/components/clients/ClientSummary"
import { ClientTimeline } from "@/components/clients/ClientTimeline"
import { ClientSessions } from "@/components/clients/ClientSessions"
import { AttachmentSection } from "@/components/attachments/AttachmentSection"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { LoadingScreen } from "@/components/LoadingScreen"
import { ErrorState } from "@/components/ErrorState"

export function ClientDetailPage() {
  const { clientId } = useParams<{ clientId: string }>()
  const navigate = useNavigate()
  const { clients, loading, error, reload, deleteClient } = useData()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const client = clients.find((c) => c.id === clientId)

  if (loading) return <LoadingScreen label="Loading client…" />
  if (error) return <ErrorState message={error} onRetry={reload} />

  if (!client) {
    return (
      <ErrorState message="This client could not be found." onRetry={() => navigate("/clients")} />
    )
  }

  const handleDelete = async () => {
    if (!clientId) return
    setDeleting(true)
    try {
      await deleteClient(clientId)
      navigate("/clients")
    } catch {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/clients" className="text-sm text-slate-500 hover:text-slate-800">
          ← Clients
        </Link>
      </div>

      <ClientHeader client={client} onEdit={() => navigate(`/clients/${client.id}/edit`)} />

      <div className="flex flex-wrap gap-2">
        <Link to={`/sessions/new?client=${client.id}`}>
          <Button>Add Session</Button>
        </Link>
        <Button variant="danger" onClick={() => setConfirmDelete(true)}>
          Delete Client
        </Button>
      </div>

      <ClientSummary client={client} />
      <ClientTimeline clientId={client.id} />
      <ClientSessions clientId={client.id} />

      <div>
        <AttachmentSection clientId={client.id} />
      </div>

      <Modal
        open={confirmDelete}
        title="Delete this client?"
        description={`This will permanently remove ${client.fullName}, all associated sessions, follow-ups, and attachments. This action cannot be undone.`}
        confirmLabel="Delete Client"
        confirmVariant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  )
}