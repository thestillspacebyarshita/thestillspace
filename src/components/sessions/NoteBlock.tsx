function NoteBlock({ label, text }: { label: string; text?: string }) {
  if (!text) return null
  return (
    <div className="break-words">
      <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </h3>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{text}</p>
    </div>
  )
}

export { NoteBlock }