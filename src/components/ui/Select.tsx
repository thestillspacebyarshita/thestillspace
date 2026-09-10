import { forwardRef, useId, type SelectHTMLAttributes } from "react"
import { FieldWrapper } from "./Field"

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, required, className = "", id, children, ...props }, ref) => {
    const autoId = useId()
    const selectId = id ?? autoId
    return (
      <FieldWrapper label={label} error={error} hint={hint} required={required} htmlFor={selectId}>
        <select
          ref={ref}
          id={selectId}
          required={required}
          aria-invalid={Boolean(error)}
          className={`w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400/40 ${
            error ? "border-red-400" : "border-slate-300"
          } ${className}`}
          {...props}
        >
          {children}
        </select>
      </FieldWrapper>
    )
  },
)
Select.displayName = "Select"
