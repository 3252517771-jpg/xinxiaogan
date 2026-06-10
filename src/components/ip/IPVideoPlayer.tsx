import GlassCard from '@/components/ui/GlassCard'
import ScoreBadge from '@/components/ui/ScoreBadge'
import { useVideoState } from '@/hooks/useVideoState'

interface IPVideoPlayerProps {
  ipId: string
  score: number
}

function IPVideoPlayer({ ipId, score }: IPVideoPlayerProps) {
  const { currentSrc, state } = useVideoState(ipId, score)

  return (
    <GlassCard eyebrow="ip state" title="角色状态机" tone="medium">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-pill border border-white/14 px-3 py-1 text-xs text-white/62">{state}</span>
        <ScoreBadge label={ipId} score={score} />
      </div>
      <video className="aspect-video w-full rounded-glass border border-white/12 object-cover" muted loop playsInline src={currentSrc} />
    </GlassCard>
  )
}

export default IPVideoPlayer
