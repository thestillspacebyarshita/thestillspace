import { useEffect, useState, type FormEvent } from "react"
import { Button } from "@/components/ui/Button"
import { Input, Textarea } from "@/components/ui/Field"
import { Select } from "@/components/ui/Select"
import { Card, CardBody, CardHeader } from "@/components/ui/Card"
import type { Client, ClientInput, ClientStatus } from "@/types/client"

const STATUS_OPTIONS: Array<{ value: ClientStatus; label: string }> = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "DISCHARGED", label: "Discharged" },
  { value: "ARCHIVED", label: "Archived" },
]

const GENDER_OPTIONS = ["", "Female", "Male", "Non-binary", "Other", "Prefer not to say"]

export interface ClientFormValues {
  code: string
  fullName: string
  preferredName: string
  dateOfBirth: string
  gender: string
  phone: string
  email: string
  address: string
  presentingConcerns: string
  diagnosis: string
  clinicalSummary: string
  treatmentGoals: string
  referralSource: string
  generalNotes: string
  status: ClientStatus
}

function toFormValues(client?: Client): ClientFormValues {
  return {
    code: client?.code ?? "",
    fullName: client?.fullName ?? "",
    preferredName: client?.preferredName ?? "",
    dateOfBirth: client?.dateOfBirth ?? "",
    gender: client?.gender ?? "",
    phone: client?.phone ?? "",
    email: client?.email ?? "",
    address: client?.address ?? "",
    presentingConcerns: client?.presentingConcerns ?? "",
    diagnosis: client?.diagnosis ?? "",
    clinicalSummary: client?.clinicalSummary ?? "",
    treatmentGoals: client?.treatmentGoals ?? "",
    referralSource: client?.referralSource ?? "",
    generalNotes: client?.generalNotes ?? "",
    status: client?.status ?? "ACTIVE",
  }
}

function toClientInput(values: ClientFormValues): ClientInput {
  return {
    code: values.code.trim(),
    fullName: values.fullName.trim(),
    preferredName: values.preferredName.trim() || undefined,
    dateOfBirth: values.dateOfBirth || undefined,
    gender: values.gender || undefined,
    phone: values.phone.trim() || undefined,
    email: values.email.trim() || undefined,
    address: values.address.trim() || undefined,
    presentingConcerns: values.presentingConcerns.trim() || undefined,
    diagnosis: values.diagnosis.trim() || undefined,
    clinicalSummary: values.clinicalSummary.trim() || undefined,
    treatmentGoals: values.treatmentGoals.trim() || undefined,
    referralSource: values.referralSource.trim() || undefined,
    generalNotes: values.generalNotes.trim() || undefined,
    status: values.status,
  }
}

interface ClientFormProps {
  initialClient?: Client
  onSubmit: (input: ClientInput) => Promise<void>
  onCancel: () => void
}

export function ClientForm({ initialClient, onSubmit, onCancel }: ClientFormProps) {
  const [values, setValues] = useState<ClientFormValues>(() => toFormValues(initialClient))
  const [initialValues] = useState<ClientFormValues>(() => toFormValues(initialClient))
  const [errors, setErrors] = useState<Partial<Record<keyof ClientFormValues, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [showDiscardDialog, setShowDiscardDialog] = useState(false)

  const dirty = JSON.stringify(values) !== JSON.stringify(initialValues)

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault()
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [dirty])

  const set = <K extends keyof ClientFormValues>(key: K, value: ClientFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const validate = (): boolean => {
    const next: Partial<Record<keyof ClientFormValues, string>> = {}
    if (!values.fullName.trim()) next.fullName = "Full name is required"
    if (!values.code.trim()) next.code = "Client code is required"
    if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      next.email = "Enter a valid email address"
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await onSubmit(toClientInput(values))
    } catch {
      // Repository-level errors surface through the page wrapper.
      setSubmitting(false)
    }
  }

  const handleAttemptCancel = () => {
    if (dirty) {
      setShowDiscardDialog(true)
    } else {
      onCancel()
    }
  }

  const handleDiscard = () => {
    setShowDiscardDialog(false)
    onCancel()
  }

  const inputGrid = "grid grid-cols-1 gap-4 sm:grid-cols-2"

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <Card>
        <CardHeader title="Basic information" description="Contact and demographic details" />
        <CardBody>
          <div className={inputGrid}>
            <Input
              label="Client Code"
              required
              value={values.code}
              error={errors.code}
              onChange={(e) => set("code", e.target.value)}
              placeholder="e.g. C-2026-001"
            />
            <Input
              label="Full Name"
              required
              value={values.fullName}
              error={errors.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              placeholder="Legal full name"
            />
          </div>
          <div className={`${inputGrid} mt-4`}>
            <Input
              label="Preferred Name"
              value={values.preferredName}
              onChange={(e) => set("preferredName", e.target.value)}
            />
            <Input
              label="Date of Birth"
              type="date"
              value={values.dateOfBirth}
              onChange={(e) => set("dateOfBirth", e.target.value)}
            />
          </div>
          <div className={`${inputGrid} mt-4`}>
            <Select
              label="Gender"
              value={values.gender}
              onChange={(e) => set("gender", e.target.value)}
            >
              {GENDER_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option || "Select…"}
                </option>
              ))}
            </Select>
            <Input
              label="Phone"
              value={values.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </div>
          <div className={`${inputGrid} mt-4`}>
            <Input
              label="Email"
              type="email"
              value={values.email}
              error={errors.email}
              onChange={(e) => set("email", e.target.value)}
            />
            <Input
              label="Address"
              value={values.address}
              onChange={(e) => set("address", e.target.value)}
            />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Clinical information" />
        <CardBody className="space-y-4">
          <Textarea
            label="Presenting Concerns"
            rows={3}
            value={values.presentingConcerns}
            onChange={(e) => set("presentingConcerns", e.target.value)}
          />
          <div className={inputGrid}>
            <Input
              label="Diagnosis"
              value={values.diagnosis}
              onChange={(e) => set("diagnosis", e.target.value)}
              placeholder="e.g. Generalized Anxiety Disorder (F41.1)"
            />
            <Input
              label="Referral Source"
              value={values.referralSource}
              onChange={(e) => set("referralSource", e.target.value)}
            />
          </div>
          <Textarea
            label="Clinical Summary"
            rows={4}
            value={values.clinicalSummary}
            onChange={(e) => set("clinicalSummary", e.target.value)}
          />
          <Textarea
            label="Treatment Goals"
            rows={3}
            value={values.treatmentGoals}
            onChange={(e) => set("treatmentGoals", e.target.value)}
          />
          <Textarea
            label="General Notes"
            rows={3}
            value={values.generalNotes}
            onChange={(e) => set("generalNotes", e.target.value)}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Administrative information" />
        <CardBody className="space-y-4">
          <div className={inputGrid}>
            <Input
              label="Date Added"
              type="date"
              value={initialClient?.dateAdded ?? new Date().toISOString().slice(0, 10)}
              disabled
              hint={initialClient ? "Set automatically on creation" : "Today's date"}
            />
            <Select
              label="Status"
              value={values.status}
              onChange={(e) => set("status", e.target.value as ClientStatus)}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </CardBody>
      </Card>

      <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
        {dirty && <span className="mr-auto text-sm text-slate-500">Unsaved changes</span>}
        <Button variant="secondary" onClick={handleAttemptCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {initialClient ? "Save Changes" : "Add Client"}
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
              <Button variant="danger" onClick={handleDiscard}>
                Discard
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}

export { toClientInput, toFormValues }