import type { Session, SessionInput } from "@/types/session"

export interface SessionRepository {
  getSessions(): Promise<Session[]>
  getSessionsByClient(clientId: string): Promise<Session[]>
  getSession(id: string): Promise<Session | null>
  createSession(input: SessionInput): Promise<Session>
  updateSession(id: string, input: SessionInput): Promise<Session>
  deleteSession(id: string): Promise<void>
}
