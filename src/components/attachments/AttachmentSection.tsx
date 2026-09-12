import { useState } from "react"
import { useData } from "@/contexts/DataContext"
import { Card, CardBody, CardHeader } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Field"
import { Modal } from "@/components/ui/Modal"
import { EmptyState } from "@/components/EmptyState"
import { formatDate, formatFileSize } from "@/lib/format"
import type { AttachmentType } from "@/types/attachment"

function classifyFile(name: string): AttachmentType {
  const ext = name.split(".").pop()?.toLowerCase() ?? ""
  if (ext === "pdf") return "PDF"
  if (ext === "doc") return "DOC"
  if (ext === "docx") return "DOCX"
  if (["jpg", "jpeg", "png", "gif", "webp", "svg", "heic", "bmp"].includes(ext)) return "Image"
  if (["form", "scan"].includes(ext)) return "Form"
  return "Other"
}

export function AttachmentSection({ clientId }: { clientId: string }) {
  const { attachments, addAttachment, deleteAttachment } = useData()
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [linkModalOpen, setLinkModalOpen] = useState(false)
  const [linkFileName, setLinkFileName] = useState("")
  const [linkUrl, setLinkUrl] = useState("")
  const [linkError, setLinkError] = useState<string | null>(null)
  const [linkSubmitting, setLinkSubmitting] = useState(false)

  const clientAttachments = attachments
    .filter((a) => a.clientId === clientId)
    .sort((a, b) => b.uploadDate.localeCompare(a.uploadDate))

  const closeLinkModal = () => {
    setLinkModalOpen(false)
    setLinkFileName("")
    setLinkUrl("")
    setLinkError(null)
    setLinkSubmitting(false)
  }

  const submitLink = async () => {
    const name = linkFileName.trim()
    const url = linkUrl.trim()
    if (!name) {
      setLinkError("File name is required")
      return
    }
    if (!url) {
      setLinkError("Document URL is required")
      return
    }
    let parsed: URL
    try {
      parsed = new URL(url)
    } catch {
      setLinkError("Enter a valid URL")
      return
    }
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      setLinkError("Enter a valid URL")
      return
    }
    setLinkError(null)
    setLinkSubmitting(true)
    try {
      await addAttachment({
        clientId,
        fileName: name,
        fileType: classifyFile(name),
        uploadDate: new Date().toISOString().slice(0, 10),
        fileSize: 0,
        url: parsed.toString(),
      })
      setLinkModalOpen(false)
      setLinkFileName("")
      setLinkUrl("")
    } catch {
      setLinkError("Unable to save the link. Please try again.")
    } finally {
      setLinkSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (!confirmId) return
    setDeleting(true)
    try {
      await deleteAttachment(confirmId)
      setConfirmId(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Card>
      <CardHeader
        title="Attachments"
        description="PDFs, documents, images, and scanned forms"
        actions={
          <div className="flex items-center gap-2">
            <a
              href="https://drive.google.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-800 px-2.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800"
            >
              Upload to Drive
            </a>
            <Button size="sm" variant="secondary" onClick={() => setLinkModalOpen(true)}>
              Add Link
            </Button>
          </div>
        }
      />
      <CardBody className="p-0">
        {clientAttachments.length === 0 ? (
          <EmptyState
            title="No attachments"
            description="Upload intake forms, referrals, or scanned documents."
          />
        ) : (
          <ul className="divide-y divide-slate-100">
            {clientAttachments.map((attachment) => (
              <li key={attachment.id} className="flex items-center justify-between gap-4 px-5 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs font-semibold text-slate-600">
                    {attachment.fileType.slice(0, 3)}
                  </span>
                  <div className="min-w-0">
                    {attachment.url ? (
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block truncate text-sm font-medium text-slate-800 hover:text-slate-600 hover:underline"
                      >
                        {attachment.fileName}
                      </a>
                    ) : (
                      <p className="truncate text-sm font-medium text-slate-800">
                        {attachment.fileName}
                      </p>
                    )}
                    <p className="text-xs text-slate-500">
                      {formatFileSize(attachment.fileSize)} ·{" "}
                      {formatDate(attachment.uploadDate)}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  {attachment.url ? (
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-md px-2.5 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
                    >
                      Open
                    </a>
                  ) : (
                    <span
                      className="cursor-not-allowed rounded-md px-2.5 py-1.5 text-sm font-medium text-slate-300"
                      title="File storage will be available in the Firebase persistence phase"
                    >
                      Open
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setConfirmId(attachment.id)}
                    className="rounded-md px-2.5 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardBody>

      <Modal
        open={linkModalOpen}
        title="Add Document Link"
        description="Link a document stored on your Google Drive."
        confirmLabel="Add Link"
        loading={linkSubmitting}
        onConfirm={submitLink}
        onCancel={closeLinkModal}
      >
        <div className="space-y-4">
          <Input
            label="File Name"
            value={linkFileName}
            onChange={(e) => setLinkFileName(e.target.value)}
            placeholder="e.g. Referral Letter"
          />
          <Input
            label="Document URL"
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://drive.google.com/file/d/…"
          />
          {linkError && (
            <p role="alert" className="text-sm text-red-600">
              {linkError}
            </p>
          )}
        </div>
      </Modal>

      <Modal
        open={confirmId !== null}
        title="Delete attachment?"
        description="This will remove the file record. This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="danger"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmId(null)}
      />
    </Card>
  )
}