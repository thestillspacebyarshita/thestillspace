import { beforeEach, describe, expect, it } from "vitest"
import { mockClientRepository } from "@/repositories/mock/MockClientRepository"
import { mockSessionRepository } from "@/repositories/mock/MockSessionRepository"
import { mockFollowUpRepository } from "@/repositories/mock/MockFollowUpRepository"
import { mockAttachmentRepository } from "@/repositories/mock/MockAttachmentRepository"

describe("MockClientRepository", () => {
  it("returns a list of clients", async () => {
    const clients = await mockClientRepository.getClients()
    expect(clients.length).toBeGreaterThan(0)
    expect(clients[0].fullName.length).toBeGreaterThan(0)
  })

  it("creates, reads, updates, and deletes a client", async () => {
    const created = await mockClientRepository.createClient({
      code: "C-TEST-001",
      fullName: "Test Person",
      dateAdded: "2026-09-12",
      status: "ACTIVE",
    })
    expect(created.id).toBeDefined()

    const fetched = await mockClientRepository.getClient(created.id)
    expect(fetched?.fullName).toBe("Test Person")

    const updated = await mockClientRepository.updateClient(created.id, {
      code: "C-TEST-001",
      fullName: "Test Person Renamed",
      dateAdded: "2026-09-12",
      status: "INACTIVE",
    })
    expect(updated.fullName).toBe("Test Person Renamed")
    expect(updated.status).toBe("INACTIVE")

    await mockClientRepository.deleteClient(created.id)
    expect(await mockClientRepository.getClient(created.id)).toBeNull()
  })
})

describe("MockSessionRepository", () => {
  it("filters sessions by client", async () => {
    const sessions = await mockSessionRepository.getSessionsByClient("c1")
    expect(sessions.length).toBeGreaterThan(0)
    expect(sessions.every((s) => s.clientId === "c1")).toBe(true)
  })

  it("creates and deletes a session", async () => {
    const created = await mockSessionRepository.createSession({
      clientId: "c9",
      title: "Test Session",
      eventType: "Individual Session",
      date: "2026-10-01",
      durationMinutes: 50,
    })
    expect(await mockSessionRepository.getSession(created.id)).toMatchObject({
      title: "Test Session",
    })
    await mockSessionRepository.deleteSession(created.id)
    expect(await mockSessionRepository.getSession(created.id)).toBeNull()
  })
})

describe("MockFollowUpRepository", () => {
  it("creates a follow-up linked to a client", async () => {
    const created = await mockFollowUpRepository.createFollowUp({
      clientId: "c1",
      date: "2026-12-01",
      reason: "Review",
      status: "Upcoming",
    })
    const byClient = await mockFollowUpRepository.getFollowUpsByClient("c1")
    expect(byClient.some((f) => f.id === created.id)).toBe(true)
    await mockFollowUpRepository.deleteFollowUp(created.id)
  })
})

describe("MockAttachmentRepository", () => {
  it("adds and removes an attachment scoped to a client", async () => {
    const created = await mockAttachmentRepository.addAttachment({
      clientId: "c5",
      fileName: "consent.pdf",
      fileType: "PDF",
      uploadDate: "2026-10-01",
      fileSize: 1024,
    })
    const list = await mockAttachmentRepository.getAttachments("c5")
    expect(list.some((a) => a.id === created.id)).toBe(true)

    await mockAttachmentRepository.deleteAttachment(created.id)
    const after = await mockAttachmentRepository.getAttachments("c5")
    expect(after.some((a) => a.id === created.id)).toBe(false)
  })
})

describe("Repository isolation between tests", () => {
  beforeEach(async () => {
    // Reset the shared module store by reloading methods only (no public reset).
  })

  it("reports unknown records as null", async () => {
    expect(await mockSessionRepository.getSession("does-not-exist")).toBeNull()
    expect(await mockClientRepository.getClient("does-not-exist")).toBeNull()
  })
})