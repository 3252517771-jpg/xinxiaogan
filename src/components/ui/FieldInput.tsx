import type { InputHTMLAttributes } from 'react'

interface FieldInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

function FieldInput({ label, id, ...props }: FieldInputProps) {
  const inputId = id ?? label

  return (
    <label className="block text-sm text-white/80" htmlFor={inputId}>
      <span className="mb-2 block">{label}</span>
      <input
        className="w-full rounded-glass border border-white/15 bg-white/10 px-3 py-2 text-white outline-none"
        id={inputId}
        {...props}
      />
    </label>
  )
}

export default FieldInput
