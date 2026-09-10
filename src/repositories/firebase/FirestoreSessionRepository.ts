import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore"
import { getFirestoreInstance } from "@/firebase/firestore"
import type { SessionRepository } from "@/repositories/SessionRepository"
import type { Session, SessionInput } from "@/types/session"
import { mapDoc, stripUndefined } from "./helpers"

function db() {
  return getFirestoreInstance()
}

export class FirestoreSessionRepository implements SessionRepository {
  async getSessions(): Promise<Session[]> {
    const snap = await getDocs(collection(db(), "sessions"))
    return snap.docs.map((d) => mapDoc<Session>(d.data(), d.id))
  }

  async getSessionsByClient(clientId: string): Promise<Session[]> {
    const snap = await getDocs(
      query(collection(db(), "sessions"), where("clientId", "==", clientId)),
    )
    return snap.docs.map((d) => mapDoc<Session>(d.data(), d.id))
  }

  async getSession(id: string): Promise<Session | null> {
    const snap = await getDoc(doc(db(), "sessions", id))
    if (!snap.exists()) return null
    return mapDoc<Session>(snap.data(), snap.id)
  }

  async createSession(input: SessionInput): Promise<Session> {
    const data = stripUndefined(input)
    const ref = await addDoc(collection(db(), "sessions"), data)
    return mapDoc<Session>(data, ref.id)
  }

  async updateSession(id: string, input: SessionInput): Promise<Session> {
    const ref = doc(db(), "sessions", id)
    const current = await getDoc(ref)
    if (!current.exists()) throw new Error("Session not found")
    await setDoc(ref, stripUndefined(input), { merge: true })
    const after = await getDoc(ref)
    return mapDoc<Session>(after.data() ?? { ...current.data(), ...input }, id)
  }

  async deleteSession(id: string): Promise<void> {
    const batch = writeBatch(db())
    batch.delete(doc(db(), "sessions", id))
    const followUps = await getDocs(
      query(collection(db(), "followUps"), where("sessionId", "==", id)),
    )
    followUps.forEach((d) => batch.delete(d.ref))
    await batch.commit()
  }
}