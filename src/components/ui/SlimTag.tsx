interface SlimTagProps {
  label: string
  active?: boolean
}

function SlimTag({ label, active = false }: SlimTagProps) {
  return (
    <span
      className={`inline-flex h-7 items-center rounded-pill border px-3 text-xs font-medium ${
        active ? 'border-dimension-exercise/70 bg-dimension-exercise/15 text-white' : 'border-white/18 bg-white/6 text-white/68'
      }`}
    >
      {label}
    </span>
  )
}

export default SlimTag
