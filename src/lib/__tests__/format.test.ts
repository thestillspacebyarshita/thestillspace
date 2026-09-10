import { describe, expect, it } from "vitest"
import { calculateAge, firstName, formatDate, formatDuration, formatFileSize } from "@/lib/format"

describe("format helpers", () => {
  it("formats ISO dates", () => {
    expect(formatDate("2026-09-05")).toBeTruthy()
    expect(formatDate()).toBe("—")
  })

  it("formats durations", () => {
    expect(formatDuration(60)).toBe("60 min")
    expect(formatDuration(undefined)).toBe("—")
  })

  it("formats file sizes", () => {
    expect(formatFileSize(512)).toBe("512 B")
    expect(formatFileSize(2048)).toBe("2.0 KB")
    expect(formatFileSize(undefined)).toBe("—")
  })

  it("extracts first names", () => {
    expect(firstName("Jane Doe")).toBe("Jane")
    expect(firstName("Priya")).toBe("Priya")
  })

  it("calculates ages from date of birth", () => {
    const age = calculateAge("1990-01-01")
    expect(age).toBeTruthy()
    expect(age).toBeGreaterThanOrEqual(36)
    expect(calculateAge(undefined)).toBeNull()
  })
})