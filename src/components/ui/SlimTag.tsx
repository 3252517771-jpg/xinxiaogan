interface SlimTagProps {
  label: string
}

function SlimTag({ label }: SlimTagProps) {
  return <span className="rounded-pill border border-white/20 px-3 py-1 text-xs text-white/80">{label}</span>
}

export default SlimTag
