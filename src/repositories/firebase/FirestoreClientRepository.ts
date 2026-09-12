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
import type { ClientRepository } from "@/repositories/ClientRepository"
import type { Client, ClientInput } from "@/types/client"
import { mapDoc, stripUndefined } from "./helpers"

function db() {
  return getFirestoreInstance()
}

export class FirestoreClientRepository implements ClientRepository {
  async getClients(): Promise<Client[]> {
    const snap = await getDocs(collection(db(), "clients"))
    return snap.docs.map((d) => mapDoc<Client>(d.data(), d.id))
  }

  async getClient(id: string): Promise<Client | null> {
    const snap = await getDoc(doc(db(), "clients", id))
    if (!snap.exists()) return null
    return mapDoc<Client>(snap.data(), snap.id)
  }

  async createClient(input: ClientInput): Promise<Client> {
    const data = stripUndefined(input)
    const ref = await addDoc(collection(db(), "clients"), data)
    return mapDoc<Client>(data, ref.id)
  }

  async updateClient(id: string, input: ClientInput): Promise<Client> {
    const ref = doc(db(), "clients", id)
    const current = await getDoc(ref)
    if (!current.exists()) throw new Error("Client not found")
    await setDoc(ref, stripUndefined(input), { merge: true })
    const after = await getDoc(ref)
    return mapDoc<Client>(after.data() ?? { ...current.data(), ...input }, id)
  }

  async deleteClient(id: string): Promise<void> {
    const batch = writeBatch(db())
    batch.delete(doc(db(), "clients", id))
    const sessions = await getDocs(
      query(collection(db(), "sessions"), where("clientId", "==", id)),
    )
    sessions.forEach((d) => batch.delete(d.ref))
    const followUps = await getDocs(
      query(collection(db(), "followUps"), where("clientId", "==", id)),
    )
    followUps.forEach((d) => batch.delete(d.ref))
    const attachments = await getDocs(
      query(collection(db(), "attachments"), where("clientId", "==", id)),
    )
    attachments.forEach((d) => batch.delete(d.ref))
    await batch.commit()
  }
}