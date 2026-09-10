import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useData } from "@/contexts/DataContext"
import { ClientForm } from "@/components/clients/ClientForm"
import { LoadingScreen } from "@/components/LoadingScreen"
import { ErrorState } from "@/components/ErrorState"
import type { ClientInput } from "@/types/client"

export function ClientFormPage({ mode }: { mode: "new" | "edit" }) {
  const { clientId } = useParams<{ clientId: string }>()
  const navigate = useNavigate()
  const { clients, loading, createClient, updateClient } = useData()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const client = mode === "edit" ? clients.find((c) => c.id === clientId) : undefined
  const isEditing = mode === "edit"

  useEffect(() => {
    if (isEditing && !loading && clientId && !client) {
      // Treat as not-found; handled below.
    }
  }, [isEditing, loading, clientId, client])

  if (loading) return <LoadingScreen label="Loading…" />

  if (isEditing && clientId && !client) {
    return (
      <ErrorState
        message="This client could not be found."
        onRetry={() => navigate("/clients")}
      />
    )
  }

  const handleSubmit = async (input: ClientInput) => {
    setSubmitError(null)
    try {
      if (isEditing && clientId) {
        await updateClient(clientId, input)
        navigate(`/clients/${clientId}`)
      } else {
        await createClient(input)
        navigate("/clients")
      }
    } catch {
      setSubmitError("Unable to save the client. Please try again.")
      throw new Error("Submit failed")
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link to="/clients" className="hover:text-slate-800">
            Clients
          </Link>
          <span>/</span>
          <span className="text-slate-700">{isEditing ? "Edit Client" : "New Client"}</span>
        </div>
        <h1 className="mt-1 text-xl font-semibold text-slate-900">
          {isEditing ? `Edit ${client?.fullName ?? "Client"}` : "Add Client"}
        </h1>
      </div>

      {submitError && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </p>
      )}

      <ClientForm
        initialClient={isEditing ? client : undefined}
        onSubmit={handleSubmit}
        onCancel={() => navigate(isEditing && clientId ? `/clients/${clientId}` : "/clients")}
      />
    </div>
  )
}