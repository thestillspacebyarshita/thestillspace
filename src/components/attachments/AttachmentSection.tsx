import { useRef, useState } from "react"
import { useData } from "@/contexts/DataContext"
import { Card, CardBody, CardHeader } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
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
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const clientAttachments = attachments
    .filter((a) => a.clientId === clientId)
    .sort((a, b) => b.uploadDate.localeCompare(a.uploadDate))

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploadError(null)
    try {
      for (const file of Array.from(files)) {
        await addAttachment({
          clientId,
          fileName: file.name,
          fileType: classifyFile(file.name),
          uploadDate: new Date().toISOString().slice(0, 10),
          fileSize: file.size,
          url: undefined,
        })
      }
    } catch {
      setUploadError("Unable to upload file. Please try again.")
    }
    if (fileInputRef.current) fileInputRef.current.value = ""
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
          <>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <Button size="sm" onClick={() => fileInputRef.current?.click()}>
              Upload
            </Button>
          </>
        }
      />
      <CardBody className="p-0">
        {uploadError && (
          <p role="alert" className="mx-5 mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {uploadError}
          </p>
        )}
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
                    <p className="truncate text-sm font-medium text-slate-800">
                      {attachment.fileName}
                    </p>
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