interface IPHotspotProps {
  label: string
}

function IPHotspot({ label }: IPHotspotProps) {
  return <button className="rounded-pill border border-white/30 px-4 py-2 text-sm text-white" type="button">{label}</button>
}

export default IPHotspot
