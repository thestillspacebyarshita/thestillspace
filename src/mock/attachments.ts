import type { Attachment } from "@/types/attachment"

// Fictional mock data only. No real client information is used.
export const mockAttachments: Attachment[] = [
  {
    id: "a1",
    clientId: "c1",
    fileName: "Referral-Letter-Bennett.pdf",
    fileType: "PDF",
    uploadDate: "2026-08-05",
    fileSize: 245760,
    url: undefined,
  },
  {
    id: "a2",
    clientId: "c1",
    fileName: "Consent-Form-2026.pdf",
    fileType: "PDF",
    uploadDate: "2026-08-05",
    fileSize: 98304,
    url: undefined,
  },
  {
    id: "a3",
    clientId: "c2",
    fileName: "Monitoring-Sheet-March.docx",
    fileType: "DOCX",
    uploadDate: "2026-07-02",
    fileSize: 409600,
    url: undefined,
  },
  {
    id: "a4",
    clientId: "c3",
    fileName: "CPR-Scan.jpg",
    fileType: "Image",
    uploadDate: "2026-07-20",
    fileSize: 1048576,
    url: undefined,
  },
]
