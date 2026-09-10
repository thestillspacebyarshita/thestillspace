import type { Attachment } from "@/types/attachment"

export interface AttachmentRepository {
  getAttachments(clientId: string): Promise<Attachment[]>
  addAttachment(input: Omit<Attachment, "id">): Promise<Attachment>
  deleteAttachment(id: string): Promise<void>
}
