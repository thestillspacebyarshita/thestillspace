import { mockAttachments } from "@/mock/attachments"
import type { AttachmentRepository } from "@/repositories/AttachmentRepository"
import type { Attachment } from "@/types/attachment"

let store: Attachment[] = [...mockAttachments]

function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export const mockAttachmentRepository: AttachmentRepository = {
  async getAttachments(clientId) {
    return store.filter((a) => a.clientId === clientId)
  },

  async addAttachment(input) {
    const attachment: Attachment = { ...input, id: makeId("a") }
    store = [...store, attachment]
    return { ...attachment }
  },

  async deleteAttachment(id) {
    store = store.filter((a) => a.id !== id)
  },
}
