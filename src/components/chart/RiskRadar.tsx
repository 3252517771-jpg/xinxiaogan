function RiskRadar() {
  return (
    <div className="grid h-44 place-items-center rounded-glass border border-white/12 bg-black/14">
      <div className="relative h-28 w-28">
        <div className="absolute inset-0 rotate-45 border border-white/14" />
        <div className="absolute inset-4 rotate-45 border border-white/14" />
        <div className="absolute inset-8 rotate-45 border border-white/14" />
        <div className="absolute left-1/2 top-2 h-24 w-16 -translate-x-1/2 rounded-[50%] bg-dimension-risk/32 blur-[1px]" />
      </div>
    </div>
  )
}

export default RiskRadar
