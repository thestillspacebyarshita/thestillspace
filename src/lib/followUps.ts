import type { FollowUpStatus } from "@/types/followup"

export function todayIso(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function effectiveFollowUpStatus(
  status: FollowUpStatus,
  date: string,
  today = todayIso(),
): FollowUpStatus {
  if (status === "Completed") return "Completed"
  if (status === "Overdue") return "Overdue"
  return date < today ? "Overdue" : "Upcoming"
}