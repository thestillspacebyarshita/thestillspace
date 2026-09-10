import type { FollowUp } from "@/types/followup"

// Fictional mock data only. No real client information is used.
export const mockFollowUps: FollowUp[] = [
  {
    id: "f1",
    clientId: "c1",
    sessionId: "s4",
    date: "2026-09-10",
    reason: "Review progress on exposure work and plan next step.",
    status: "Upcoming",
  },
  {
    id: "f2",
    clientId: "c2",
    sessionId: "s7",
    date: "2026-09-10",
    reason: "Post-discharge review of relapse-prevention plan.",
    status: "Upcoming",
  },
  {
    id: "f3",
    clientId: "c3",
    sessionId: "s9",
    date: "2026-09-12",
    reason: "Continue situational exposure and review progress.",
    status: "Upcoming",
  },
  {
    id: "f4",
    clientId: "c6",
    sessionId: "s13",
    date: "2026-09-03",
    reason: "Review written memory reflection.",
    status: "Overdue",
  },
  {
    id: "f5",
    clientId: "c4",
    sessionId: "s10",
    date: "2026-08-28",
    reason: "Review workplace boundary changes.",
    status: "Completed",
  },
  {
    id: "f6",
    clientId: "c9",
    sessionId: "s15",
    date: "2026-09-18",
    reason: "Continue self-compassion work.",
    status: "Upcoming",
  },
]
