import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore"
import { getFirestoreInstance } from "@/firebase/firestore"
import type { AttachmentRepository } from "@/repositories/AttachmentRepository"
import type { Attachment } from "@/types/attachment"
import { mapDoc, stripUndefined } from "./helpers"

function db() {
  return getFirestoreInstance()
}

/**
 * Metadata-only attachment persistence. File contents are not uploaded yet;
 * only the record (name, type, size, date) is stored so the UI behaves fully
 * while the Drive/Storage integration is deferred.
 */
export class FirestoreAttachmentRepository implements AttachmentRepository {
  async getAttachments(clientId: string): Promise<Attachment[]> {
    const snap = await getDocs(
      query(collection(db(), "attachments"), where("clientId", "==", clientId)),
    )
    return snap.docs.map((d) => mapDoc<Attachment>(d.data(), d.id))
  }

  async addAttachment(input: Omit<Attachment, "id">): Promise<Attachment> {
    const data = stripUndefined(input)
    const ref = await addDoc(collection(db(), "attachments"), data)
    return mapDoc<Attachment>(data, ref.id)
  }

  async deleteAttachment(id: string): Promise<void> {
    await deleteDoc(doc(db(), "attachments", id))
  }
}