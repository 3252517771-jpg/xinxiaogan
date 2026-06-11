import GlassCard from '@/components/ui/GlassCard'
import ScoreBadge from '@/components/ui/ScoreBadge'
import { useVideoState } from '@/hooks/useVideoState'

interface IPVideoPlayerProps {
  ipId: string
  score: number
}

function IPVideoPlayer({ ipId, score }: IPVideoPlayerProps) {
  const { scene, activeState, handleVideoEnded } = useVideoState(ipId, score)

  return (
    <GlassCard eyebrow="ip state" title="角色状态机" tone="medium">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-pill border border-white/14 px-3 py-1 text-xs text-white/62">{activeState}</span>
        <ScoreBadge label={ipId} score={score} />
      </div>
      <video
        autoPlay
        className={`aspect-video w-full rounded-glass border border-white/12 object-cover ${scene.filterClassName ?? ''}`.trim()}
        loop={scene.loop}
        muted
        onEnded={handleVideoEnded}
        playsInline
        poster={scene.poster}
        src={scene.source}
      />
    </GlassCard>
  )
}

export default IPVideoPlayer
