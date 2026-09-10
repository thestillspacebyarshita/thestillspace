import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  attachmentRepository,
  clientRepository,
  followUpRepository,
  sessionRepository,
} from "@/services/repositories"
import type { Attachment } from "@/types/attachment"
import type { Client, ClientInput } from "@/types/client"
import type { FollowUp, FollowUpInput } from "@/types/followup"
import type { Session, SessionInput } from "@/types/session"

interface DataContextValue {
  clients: Client[]
  sessions: Session[]
  followUps: FollowUp[]
  attachments: Attachment[]
  loading: boolean
  error: string | null
  reload: () => Promise<void>

  createClient: (input: ClientInput) => Promise<Client>
  updateClient: (id: string, input: ClientInput) => Promise<Client>
  deleteClient: (id: string) => Promise<void>

  createSession: (input: SessionInput) => Promise<Session>
  updateSession: (id: string, input: SessionInput) => Promise<Session>
  deleteSession: (id: string) => Promise<void>

  createFollowUp: (input: FollowUpInput) => Promise<FollowUp>
  updateFollowUp: (id: string, input: FollowUpInput) => Promise<FollowUp>
  deleteFollowUp: (id: string) => Promise<void>

  addAttachment: (input: Omit<Attachment, "id">) => Promise<Attachment>
  deleteAttachment: (id: string) => Promise<void>
}

const DataContext = createContext<DataContextValue | undefined>(undefined)

/**
 * Central data provider. Loads all data from the configured repositories
 * (currently the mock implementations) and exposes CRUD operations that keep
 * the in-memory store in sync. The UI never touches repositories directly.
 */
export function DataProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [followUps, setFollowUps] = useState<FollowUp[]>([])
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [nextClients, nextSessions, nextFollowUps] = await Promise.all([
        clientRepository.getClients(),
        sessionRepository.getSessions(),
        followUpRepository.getFollowUps(),
      ])

      const attachmentList: Attachment[] = []
      for (const client of nextClients) {
        const clientAttachments = await attachmentRepository.getAttachments(client.id)
        attachmentList.push(...clientAttachments)
      }

      setClients(nextClients)
      setSessions(nextSessions)
      setFollowUps(nextFollowUps)
      setAttachments(attachmentList)
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load data")
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  const createClient = useCallback(async (input: ClientInput) => {
    const created = await clientRepository.createClient(input)
    setClients((prev) => [created, ...prev])
    return created
  }, [])

  const updateClient = useCallback(async (id: string, input: ClientInput) => {
    const updated = await clientRepository.updateClient(id, input)
    setClients((prev) => prev.map((c) => (c.id === id ? updated : c)))
    return updated
  }, [])

  const deleteClient = useCallback(async (id: string) => {
    await clientRepository.deleteClient(id)
    setClients((prev) => prev.filter((c) => c.id !== id))
    setSessions((prev) => prev.filter((s) => s.clientId !== id))
    setFollowUps((prev) => prev.filter((f) => f.clientId !== id))
    setAttachments((prev) => prev.filter((a) => a.clientId !== id))
  }, [])

  const createSession = useCallback(async (input: SessionInput) => {
    const created = await sessionRepository.createSession(input)
    setSessions((prev) => [...prev, created])
    return created
  }, [])

  const updateSession = useCallback(async (id: string, input: SessionInput) => {
    const updated = await sessionRepository.updateSession(id, input)
    setSessions((prev) => prev.map((s) => (s.id === id ? updated : s)))
    return updated
  }, [])

  const deleteSession = useCallback(async (id: string) => {
    await sessionRepository.deleteSession(id)
    setSessions((prev) => prev.filter((s) => s.id !== id))
    setFollowUps((prev) => prev.filter((f) => f.sessionId !== id))
  }, [])

  const createFollowUp = useCallback(async (input: FollowUpInput) => {
    const created = await followUpRepository.createFollowUp(input)
    setFollowUps((prev) => [...prev, created])
    return created
  }, [])

  const updateFollowUp = useCallback(async (id: string, input: FollowUpInput) => {
    const updated = await followUpRepository.updateFollowUp(id, input)
    setFollowUps((prev) => prev.map((f) => (f.id === id ? updated : f)))
    return updated
  }, [])

  const deleteFollowUp = useCallback(async (id: string) => {
    await followUpRepository.deleteFollowUp(id)
    setFollowUps((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const addAttachment = useCallback(async (input: Omit<Attachment, "id">) => {
    const created = await attachmentRepository.addAttachment(input)
    setAttachments((prev) => [...prev, created])
    return created
  }, [])

  const deleteAttachment = useCallback(async (id: string) => {
    await attachmentRepository.deleteAttachment(id)
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const value = useMemo<DataContextValue>(
    () => ({
      clients,
      sessions,
      followUps,
      attachments,
      loading,
      error,
      reload,
      createClient,
      updateClient,
      deleteClient,
      createSession,
      updateSession,
      deleteSession,
      createFollowUp,
      updateFollowUp,
      deleteFollowUp,
      addAttachment,
      deleteAttachment,
    }),
    [
      clients,
      sessions,
      followUps,
      attachments,
      loading,
      error,
      reload,
      createClient,
      updateClient,
      deleteClient,
      createSession,
      updateSession,
      deleteSession,
      createFollowUp,
      updateFollowUp,
      deleteFollowUp,
      addAttachment,
      deleteAttachment,
    ],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData(): DataContextValue {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}