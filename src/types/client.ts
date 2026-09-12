export type ClientStatus = "ACTIVE" | "INACTIVE" | "DISCHARGED" | "ARCHIVED"

export interface Client {
  id: string
  code: string
  fullName: string
  preferredName?: string
  dateOfBirth?: string
  gender?: string
  phone?: string
  email?: string
  address?: string

  presentingConcerns?: string
  diagnosis?: string
  clinicalSummary?: string
  treatmentGoals?: string
  referralSource?: string
  generalNotes?: string

  dateAdded: string
  status: ClientStatus
}

export interface ClientInput {
  code: string
  fullName: string
  preferredName?: string
  dateOfBirth?: string
  gender?: string
  phone?: string
  email?: string
  address?: string

  presentingConcerns?: string
  diagnosis?: string
  clinicalSummary?: string
  treatmentGoals?: string
  referralSource?: string
  generalNotes?: string

  dateAdded: string
  status: ClientStatus
}
