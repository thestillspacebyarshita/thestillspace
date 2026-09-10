import { useEffect, useState, type FormEvent } from "react"
import { Button } from "@/components/ui/Button"
import { Input, Textarea } from "@/components/ui/Field"
import { Select } from "@/components/ui/Select"
import { Card, CardBody, CardHeader } from "@/components/ui/Card"
import { EVENT_TYPES, type EventType, type Session, type SessionInput } from "@/types/session"
import type { Client } from "@/types/client"

const DURATION_PRESETS = [30, 45, 50, 60, 75, 90]

interface SessionFormValues {
  clientId: string
  title: string
  eventType: EventType
  date: string
  startTime: string
  durationPreset: number | "custom"
  durationCustom: string
  sessionNotes: string
  assessment: string
  interventions: string
  clientResponse: string
  riskAssessment: string
  homework: string
  plan: string
  followUpDate: string
}

function toFormValues(session?: Session): SessionFormValues {
  const duration = session?.durationMinutes
  const preset =
    duration != null && DURATION_PRESETS.includes(duration)
      ? duration
      : session
        ? "custom"
        : 50
  return {
    clientId: session?.clientId ?? "",
    title: session?.title ?? "",
    eventType: session?.eventType ?? "Individual Session",
    date: session?.date ?? "",
    startTime: session?.startTime ?? "",
    durationPreset: preset,
    durationCustom: preset === "custom" && session ? String(session.durationMinutes) : "",
    sessionNotes: session?.sessionNotes ?? "",
    assessment: session?.assessment ?? "",
    interventions: session?.interventions ?? "",
    clientResponse: session?.clientResponse ?? "",
    riskAssessment: session?.riskAssessment ?? "",
    homework: session?.homework ?? "",
    plan: session?.plan ?? "",
    followUpDate: session?.followUpDate ?? "",
  }
}

function toSessionInput(values: SessionFormValues): SessionInput {
  const durationMinutes =
    values.durationPreset === "custom"
      ? Math.max(1, Number.parseInt(values.durationCustom, 10) || 0)
      : values.durationPreset
  return {
    clientId: values.clientId,
    title: values.title.trim(),
    eventType: values.eventType,
    date: values.date,
    startTime: values.startTime || undefined,
    durationMinutes,
    sessionNotes: values.sessionNotes.trim() || undefined,
    assessment: values.assessment.trim() || undefined,
    interventions: values.interventions.trim() || undefined,
    clientResponse: values.clientResponse.trim() || undefined,
    riskAssessment: values.riskAssessment.trim() || undefined,
    homework: values.homework.trim() || undefined,
    plan: values.plan.trim() || undefined,
    followUpDate: values.followUpDate || undefined,
  }
}

interface SessionFormProps {
  clients: Client[]
  initialSession?: Session
  preselectedClientId?: string
  onSubmit: (input: SessionInput) => Promise<void>
  onCancel: () => void
}

export function SessionForm({
  clients,
  initialSession,
  preselectedClientId,
  onSubmit,
  onCancel,
}: SessionFormProps) {
  const [values, setValues] = useState<SessionFormValues>(() =>
    toFormValues(initialSession),
  )
  const [initialValues] = useState<SessionFormValues>(() => toFormValues(initialSession))
  const [errors, setErrors] = useState<Partial<Record<keyof SessionFormValues, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [showDiscardDialog, setShowDiscardDialog] = useState(false)

  const dirty = JSON.stringify(values) !== JSON.stringify(initialValues)

  useEffect(() => {
    if (!initialSession && preselectedClientId && !values.clientId) {
      setValues((prev) => ({ ...prev, clientId: preselectedClientId }))
    }
  }, [initialSession, preselectedClientId, values.clientId])

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault()
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [dirty])

  const set = <K extends keyof SessionFormValues>(key: K, value: SessionFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const validate = (): boolean => {
    const next: Partial<Record<keyof SessionFormValues, string>> = {}
    if (!values.clientId) next.clientId = "Select a client"
    if (!values.title.trim()) next.title = "Session title is required"
    if (!values.date) next.date = "Select a date"
    if (values.durationPreset === "custom") {
      const custom = Number.parseInt(values.durationCustom, 10)
      if (!Number.isFinite(custom) || custom <= 0) {
        next.durationCustom = "Enter a positive duration in minutes"
      }
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await onSubmit(toSessionInput(values))
    } catch {
      setSubmitting(false)
    }
  }

  const handleAttemptCancel = () => {
    if (dirty) setShowDiscardDialog(true)
    else onCancel()
  }

  const inputGrid = "grid grid-cols-1 gap-4 sm:grid-cols-2"

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <Card>
        <CardHeader title="Session information" />
        <CardBody>
          <div className={inputGrid}>
            <Select
              label="Client"
              required
              value={values.clientId}
              error={errors.clientId}
              onChange={(e) => set("clientId", e.target.value)}
            >
              <option value="">Select client…</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.fullName} ({client.code})
                </option>
              ))}
            </Select>
            <Input
              label="Session Title"
              required
              value={values.title}
              error={errors.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Initial Assessment"
            />
          </div>

          <div className={`${inputGrid} mt-4`}>
            <Select
              label="Event Type"
              value={values.eventType}
              onChange={(e) => set("eventType", e.target.value as EventType)}
            >
              {EVENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
            <Input
              label="Date"
              type="date"
              required
              value={values.date}
              error={errors.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </div>

          <div className={`${inputGrid} mt-4`}>
            <Input
              label="Start Time"
              type="time"
              value={values.startTime}
              onChange={(e) => set("startTime", e.target.value)}
            />
            <div>
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Duration</span>
              <div className="flex flex-wrap items-center gap-2">
                {DURATION_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => set("durationPreset", preset)}
                    className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                      values.durationPreset === preset
                        ? "border-slate-800 bg-slate-800 text-white"
                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                    aria-pressed={values.durationPreset === preset}
                  >
                    {preset} min
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => set("durationPreset", "custom")}
                  aria-pressed={values.durationPreset === "custom"}
                  className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                    values.durationPreset === "custom"
                      ? "border-slate-800 bg-slate-800 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Custom
                </button>
              </div>
              {values.durationPreset === "custom" && (
                <div className="mt-2">
                  <label
                    htmlFor="duration-custom"
                    className="sr-only"
                  >
                    Custom duration in minutes
                  </label>
                  <input
                    id="duration-custom"
                    type="number"
                    min={1}
                    value={values.durationCustom}
                    onChange={(e) => set("durationCustom", e.target.value)}
                    placeholder="Minutes"
                    className={`w-32 rounded-md border bg-white px-3 py-1.5 text-sm ${
                      errors.durationCustom ? "border-red-400" : "border-slate-300"
                    }`}
                  />
                  {errors.durationCustom && (
                    <p className="mt-1 text-sm text-red-600">{errors.durationCustom}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Clinical note" description="Record the content of the session" />
        <CardBody className="space-y-4">
          <Textarea
            label="Session Notes"
            rows={6}
            className="leading-relaxed"
            value={values.sessionNotes}
            onChange={(e) => set("sessionNotes", e.target.value)}
          />
          <div className={inputGrid}>
            <Textarea
              label="Assessment"
              rows={3}
              value={values.assessment}
              onChange={(e) => set("assessment", e.target.value)}
            />
            <Textarea
              label="Interventions"
              rows={3}
              value={values.interventions}
              onChange={(e) => set("interventions", e.target.value)}
            />
          </div>
          <div className={inputGrid}>
            <Textarea
              label="Client Response"
              rows={3}
              value={values.clientResponse}
              onChange={(e) => set("clientResponse", e.target.value)}
            />
            <Textarea
              label="Risk Assessment"
              rows={3}
              value={values.riskAssessment}
              onChange={(e) => set("riskAssessment", e.target.value)}
            />
          </div>
          <div className={inputGrid}>
            <Textarea
              label="Homework / Tasks"
              rows={3}
              value={values.homework}
              onChange={(e) => set("homework", e.target.value)}
            />
            <Textarea
              label="Plan"
              rows={3}
              value={values.plan}
              onChange={(e) => set("plan", e.target.value)}
            />
          </div>
          <div className={inputGrid}>
            <Input
              label="Follow-up Date"
              type="date"
              value={values.followUpDate}
              onChange={(e) => set("followUpDate", e.target.value)}
            />
          </div>
        </CardBody>
      </Card>

      <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
        {dirty && <span className="mr-auto text-sm text-slate-500">Unsaved changes</span>}
        <Button variant="secondary" onClick={handleAttemptCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {initialSession ? "Save Changes" : "Add Session"}
        </Button>
      </div>

      {showDiscardDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setShowDiscardDialog(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-base font-semibold text-slate-900">Discard unsaved changes?</h2>
            <p className="mt-1 text-sm text-slate-600">
              You have unsaved changes. Leaving this page will discard them.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowDiscardDialog(false)}>
                Keep editing
              </Button>
              <Button variant="danger" onClick={() => { setShowDiscardDialog(false); onCancel() }}>
                Discard
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}

export { toSessionInput, toFormValues }