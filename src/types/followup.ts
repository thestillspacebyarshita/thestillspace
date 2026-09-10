export type FollowUpStatus = "Upcoming" | "Completed" | "Overdue"

export interface FollowUp {
  id: string
  clientId: string
  sessionId?: string
  date: string
  reason?: string
  status: FollowUpStatus
}

export interface FollowUpInput {
  clientId: string
  sessionId?: string
  date: string
  reason?: string
  status: FollowUpStatus
}
