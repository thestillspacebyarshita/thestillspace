import { getStorage, type FirebaseStorage } from "firebase/storage"
import { getFirebaseApp } from "./config"

let storageInstance: FirebaseStorage | null = null

/**
 * Returns a singleton Firebase Storage instance, initialized lazily from the
 * shared Firebase app. Storage paths/metadata are not finalized here yet.
 */
export function getStorageInstance(): FirebaseStorage {
  if (!storageInstance) {
    storageInstance = getStorage(getFirebaseApp())
  }
  return storageInstance
}
