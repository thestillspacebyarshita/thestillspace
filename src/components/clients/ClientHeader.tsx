import { Link } from "react-router-dom"
import type { Client } from "@/types/client"
import { ClientStatusBadge } from "@/components/ui/StatusBadge"
import { Button } from "@/components/ui/Button"
import { formatDate } from "@/lib/format"

interface ClientHeaderProps {
  client: Client
  onEdit: () => void
}

export function ClientHeader({ client, onEdit }: ClientHeaderProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-semibold text-slate-900">{client.fullName}</h1>
            {client.preferredName && (
              <span className="text-sm text-slate-500">({client.preferredName})</span>
            )}
            <ClientStatusBadge status={client.status} />
          </div>
          <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-500">
            <div>
              <dt className="inline">Code: </dt>
              <dd className="inline font-medium text-slate-700">{client.code}</dd>
            </div>
            <div>
              <dt className="inline">Date added: </dt>
              <dd className="inline font-medium text-slate-700">{formatDate(client.dateAdded)}</dd>
            </div>
            {client.email && (
              <div>
                <dt className="inline">Email: </dt>
                <dd className="inline font-medium text-slate-700">{client.email}</dd>
              </div>
            )}
          </dl>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={onEdit}>
            Edit Client
          </Button>
          <Link to={`/sessions/new?client=${client.id}`}>
            <Button size="sm">Add Session</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}