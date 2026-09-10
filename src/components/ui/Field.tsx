import { forwardRef, useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react"

interface FieldWrapperProps {
  label?: string
  error?: string
  hint?: string
  required?: boolean
  htmlFor: string
  children: React.ReactNode
}

export function FieldWrapper({ label, error, hint, required, htmlFor, children }: FieldWrapperProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex items-center">
          <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">
            {label}
          </label>
          {required && (
            <span aria-hidden="true" className="ml-0.5 text-sm leading-none text-slate-400">
              *
            </span>
          )}
        </div>
      )}
      {children}
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-sm text-slate-500">{hint}</p>
      ) : null}
    </div>
  )
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, required, className = "", id, ...props }, ref) => {
    const autoId = useId()
    const inputId = id ?? autoId
    return (
      <FieldWrapper label={label} error={error} hint={hint} required={required} htmlFor={inputId}>
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={Boolean(error)}
          className={`w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/40 ${
            error ? "border-red-400" : "border-slate-300"
          } ${className}`}
          {...props}
        />
      </FieldWrapper>
    )
  },
)
Input.displayName = "Input"

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, required, className = "", id, rows = 4, ...props }, ref) => {
    const autoId = useId()
    const inputId = id ?? autoId
    return (
      <FieldWrapper label={label} error={error} hint={hint} required={required} htmlFor={inputId}>
        <textarea
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={Boolean(error)}
          rows={rows}
          className={`w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/40 ${
            error ? "border-red-400" : "border-slate-300"
          } ${className}`}
          {...props}
        />
      </FieldWrapper>
    )
  },
)
Textarea.displayName = "Textarea"
