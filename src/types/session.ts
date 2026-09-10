export type EventType =
  | "Individual Session"
  | "Adolescent Session"
  | "Family Session"
  | "Couples Session"
  | "Group Session"
  | "Trauma Session"
  | "Assessment"
  | "Follow-up"
  | "Crisis Session"
  | "Other"

export const EVENT_TYPES: EventType[] = [
  "Individual Session",
  "Adolescent Session",
  "Family Session",
  "Couples Session",
  "Group Session",
  "Trauma Session",
  "Assessment",
  "Follow-up",
  "Crisis Session",
  "Other",
]

export interface SessionNote {
  sessionNotes?: string
  assessment?: string
  interventions?: string
  clientResponse?: string
  riskAssessment?: string
  homework?: string
  plan?: string
  followUpDate?: string
}

export interface Session extends SessionNote {
  id: string
  clientId: string
  title: string
  eventType: EventType
  date: string
  startTime?: string
  durationMinutes: number
}

export interface SessionInput extends SessionNote {
  clientId: string
  title: string
  eventType: EventType
  date: string
  startTime?: string
  durationMinutes: number
}
