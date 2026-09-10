import { mockFollowUps } from "@/mock/followups"
import type { FollowUpRepository } from "@/repositories/FollowUpRepository"
import type { FollowUp } from "@/types/followup"

let store: FollowUp[] = [...mockFollowUps]

function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export const mockFollowUpRepository: FollowUpRepository = {
  async getFollowUps() {
    return [...store]
  },

  async getFollowUpsByClient(clientId) {
    return store.filter((f) => f.clientId === clientId)
  },

  async getFollowUp(id) {
    const found = store.find((f) => f.id === id)
    return found ? { ...found } : null
  },

  async createFollowUp(input) {
    const followUp: FollowUp = { ...input, id: makeId("f") }
    store = [...store, followUp]
    return { ...followUp }
  },

  async updateFollowUp(id, input) {
    const existing = store.find((f) => f.id === id)
    if (!existing) throw new Error("Follow-up not found")
    const updated: FollowUp = { ...existing, ...input }
    store = store.map((f) => (f.id === id ? updated : f))
    return { ...updated }
  },

  async deleteFollowUp(id) {
    store = store.filter((f) => f.id !== id)
  },
}
