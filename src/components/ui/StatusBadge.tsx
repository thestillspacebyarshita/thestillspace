import type { ClientStatus } from "@/types/client"
import type { FollowUpStatus } from "@/types/followup"

const clientStatusStyles: Record<ClientStatus, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  INACTIVE: "bg-amber-50 text-amber-700 ring-amber-600/20",
  DISCHARGED: "bg-slate-100 text-slate-600 ring-slate-500/20",
  ARCHIVED: "bg-slate-100 text-slate-500 ring-slate-400/20",
}

const followUpStatusStyles: Record<FollowUpStatus, string> = {
  Upcoming: "bg-blue-50 text-blue-700 ring-blue-600/20",
  Completed: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Overdue: "bg-red-50 text-red-700 ring-red-600/20",
}

function Badge({ label, style }: { label: string; style: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${style}`}
    >
      {label}
    </span>
  )
}

export function ClientStatusBadge({ status }: { status: ClientStatus }) {
  return <Badge label={status} style={clientStatusStyles[status]} />
}

export function FollowUpStatusBadge({ status }: { status: FollowUpStatus }) {
  return <Badge label={status} style={followUpStatusStyles[status]} />
}
