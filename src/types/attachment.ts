export type AttachmentType =
  | "PDF"
  | "DOC"
  | "DOCX"
  | "Image"
  | "Form"
  | "Other"

export interface Attachment {
  id: string
  clientId: string
  fileName: string
  fileType: string
  uploadDate: string
  fileSize: number
  url?: string
}
