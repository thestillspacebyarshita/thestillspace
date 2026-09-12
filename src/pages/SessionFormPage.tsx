import { useEffect, useState } from "react"
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { useData } from "@/contexts/DataContext"
import { SessionForm } from "@/components/sessions/SessionForm"
import { LoadingScreen } from "@/components/LoadingScreen"
import { ErrorState } from "@/components/ErrorState"
import { effectiveFollowUpStatus } from "@/lib/followUps"
import type { SessionInput } from "@/types/session"

export function SessionFormPage({ mode }: { mode: "new" | "edit" }) {
  const { sessionId } = useParams<{ sessionId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const {
    clients,
    sessions,
    followUps,
    loading,
    createSession,
    updateSession,
    createFollowUp,
    updateFollowUp,
    deleteFollowUp,
  } = useData()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const session = mode === "edit" ? sessions.find((s) => s.id === sessionId) : undefined
  const isEditing = mode === "edit"
  const preselectedClientId = searchParams.get("client") ?? undefined

  useEffect(() => {
    // No-op safety: ensures new-session mode resets when navigating between records.
  }, [])

  if (loading) return <LoadingScreen label="Loading…" />

  if (isEditing && sessionId && !session) {
    return <ErrorState message="This session could not be found." />
  }

  const handleSubmit = async (input: SessionInput) => {
    setSubmitError(null)
    try {
      if (isEditing && sessionId) {
        await updateSession(sessionId, input)
        const existingFollowUp = followUps.find((f) => f.sessionId === sessionId)
        if (input.followUpDate) {
          const followUpInput = {
            clientId: input.clientId,
            sessionId,
            date: input.followUpDate,
            reason: existingFollowUp?.reason ?? `Follow-up after "${input.title}"`,
            status: effectiveFollowUpStatus(
              existingFollowUp?.status ?? "Upcoming",
              input.followUpDate,
            ),
          }
          if (existingFollowUp) {
            await updateFollowUp(existingFollowUp.id, followUpInput)
          } else {
            await createFollowUp(followUpInput)
          }
        } else if (existingFollowUp) {
          await deleteFollowUp(existingFollowUp.id)
        }
        navigate(`/sessions/${sessionId}`)
      } else {
        const created = await createSession(input)
        if (input.followUpDate) {
          await createFollowUp({
            clientId: input.clientId,
            sessionId: created.id,
            date: input.followUpDate,
            reason: `Follow-up after "${input.title}"`,
            status: effectiveFollowUpStatus("Upcoming", input.followUpDate),
          })
        }
        navigate(preselectedClientId ? `/clients/${preselectedClientId}` : "/sessions")
      }
    } catch {
      setSubmitError("Unable to save the session. Please try again.")
      throw new Error("Submit failed")
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link to="/sessions" className="hover:text-slate-800">
            Sessions
          </Link>
          <span>/</span>
          <span className="text-slate-700">{isEditing ? "Edit Session" : "New Session"}</span>
        </div>
        <h1 className="mt-1 text-xl font-semibold text-slate-900">
          {isEditing ? "Edit Session" : "Add Session"}
        </h1>
      </div>

      {submitError && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </p>
      )}

      <SessionForm
        clients={clients}
        initialSession={isEditing ? session : undefined}
        preselectedClientId={preselectedClientId}
        onSubmit={handleSubmit}
        onCancel={() => navigate(isEditing && sessionId ? `/sessions/${sessionId}` : "/sessions")}
      />
    </div>
  )
}