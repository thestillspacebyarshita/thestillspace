import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore"
import { getFirestoreInstance } from "@/firebase/firestore"
import type { FollowUpRepository } from "@/repositories/FollowUpRepository"
import type { FollowUp, FollowUpInput } from "@/types/followup"
import { mapDoc, stripUndefined } from "./helpers"

function db() {
  return getFirestoreInstance()
}

export class FirestoreFollowUpRepository implements FollowUpRepository {
  async getFollowUps(): Promise<FollowUp[]> {
    const snap = await getDocs(collection(db(), "followUps"))
    return snap.docs.map((d) => mapDoc<FollowUp>(d.data(), d.id))
  }

  async getFollowUpsByClient(clientId: string): Promise<FollowUp[]> {
    const snap = await getDocs(
      query(collection(db(), "followUps"), where("clientId", "==", clientId)),
    )
    return snap.docs.map((d) => mapDoc<FollowUp>(d.data(), d.id))
  }

  async getFollowUp(id: string): Promise<FollowUp | null> {
    const snap = await getDoc(doc(db(), "followUps", id))
    if (!snap.exists()) return null
    return mapDoc<FollowUp>(snap.data(), snap.id)
  }

  async createFollowUp(input: FollowUpInput): Promise<FollowUp> {
    const data = stripUndefined(input)
    const ref = await addDoc(collection(db(), "followUps"), data)
    return mapDoc<FollowUp>(data, ref.id)
  }

  async updateFollowUp(id: string, input: FollowUpInput): Promise<FollowUp> {
    const ref = doc(db(), "followUps", id)
    const current = await getDoc(ref)
    if (!current.exists()) throw new Error("Follow-up not found")
    await setDoc(ref, stripUndefined(input), { merge: true })
    const after = await getDoc(ref)
    return mapDoc<FollowUp>(after.data() ?? { ...current.data(), ...input }, id)
  }

  async deleteFollowUp(id: string): Promise<void> {
    await deleteDoc(doc(db(), "followUps", id))
  }
}