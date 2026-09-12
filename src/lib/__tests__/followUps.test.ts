import { describe, expect, it } from "vitest"
import { effectiveFollowUpStatus, todayIso } from "../followUps"

describe("todayIso", () => {
  it("returns a YYYY-MM-DD string", () => {
    expect(todayIso()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe("effectiveFollowUpStatus", () => {
  const today = "2026-09-12"

  it("returns Completed when stored status is Completed regardless of date", () => {
    expect(effectiveFollowUpStatus("Completed", "2025-01-01", today)).toBe("Completed")
    expect(effectiveFollowUpStatus("Completed", "2099-12-31", today)).toBe("Completed")
  })

  it("returns Overdue when stored status is Overdue regardless of date", () => {
    expect(effectiveFollowUpStatus("Overdue", "2099-12-31", today)).toBe("Overdue")
    expect(effectiveFollowUpStatus("Overdue", "2020-05-05", today)).toBe("Overdue")
  })

  it("returns Overdue for Upcoming status when date is before today", () => {
    expect(effectiveFollowUpStatus("Upcoming", "2026-08-01", today)).toBe("Overdue")
    expect(effectiveFollowUpStatus("Upcoming", "2020-01-01", today)).toBe("Overdue")
  })

  it("returns Upcoming for Upcoming status when date is today", () => {
    expect(effectiveFollowUpStatus("Upcoming", "2026-09-12", today)).toBe("Upcoming")
  })

  it("returns Upcoming for Upcoming status when date is in the future", () => {
    expect(effectiveFollowUpStatus("Upcoming", "2027-01-01", today)).toBe("Upcoming")
  })
})