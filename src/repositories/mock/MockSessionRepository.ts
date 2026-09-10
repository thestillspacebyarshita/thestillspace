import { mockSessions } from "@/mock/sessions"
import type { SessionRepository } from "@/repositories/SessionRepository"
import type { Session } from "@/types/session"

let store: Session[] = [...mockSessions]

function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export const mockSessionRepository: SessionRepository = {
  async getSessions() {
    return [...store]
  },

  async getSessionsByClient(clientId) {
    return store.filter((s) => s.clientId === clientId)
  },

  async getSession(id) {
    const found = store.find((s) => s.id === id)
    return found ? { ...found } : null
  },

  async createSession(input) {
    const session: Session = { ...input, id: makeId("s") }
    store = [...store, session]
    return { ...session }
  },

  async updateSession(id, input) {
    const existing = store.find((s) => s.id === id)
    if (!existing) throw new Error("Session not found")
    const updated: Session = { ...existing, ...input }
    store = store.map((s) => (s.id === id ? updated : s))
    return { ...updated }
  },

  async deleteSession(id) {
    store = store.filter((s) => s.id !== id)
  },
}
