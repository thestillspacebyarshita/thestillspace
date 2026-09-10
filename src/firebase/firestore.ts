import { getFirestore, type Firestore } from "firebase/firestore"
import { getFirebaseApp } from "./config"

let firestoreInstance: Firestore | null = null

/**
 * Returns a singleton Firestore instance, initialized lazily from the shared
 * Firebase app. No collections or schema are defined here yet — the data
 * model is designed in a later phase.
 */
export function getFirestoreInstance(): Firestore {
  if (!firestoreInstance) {
    firestoreInstance = getFirestore(getFirebaseApp())
  }
  return firestoreInstance
}
