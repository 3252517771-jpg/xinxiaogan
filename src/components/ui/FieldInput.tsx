import type { InputHTMLAttributes } from 'react'

interface FieldInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
}

function FieldInput({ label, hint, id, ...props }: FieldInputProps) {
  const inputId = id ?? label

  return (
    <label className="block text-sm text-white/78" htmlFor={inputId}>
      <span className="mb-2 flex items-center justify-between gap-3">
        <span>{label}</span>
        {hint ? <span className="text-xs text-white/42">{hint}</span> : null}
      </span>
      <input
        className="h-11 w-full rounded-glass border border-white/15 bg-black/18 px-3 text-white outline-none transition placeholder:text-white/30 focus:border-dimension-exercise/70 focus:bg-black/24 focus:ring-2 focus:ring-dimension-exercise/20"
        id={inputId}
        {...props}
      />
    </label>
  )
}

export default FieldInput
