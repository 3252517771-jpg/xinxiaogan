import { useVideoState } from '@/hooks/useVideoState'

interface IPVideoPlayerProps {
  ipId: string
  score: number
}

function IPVideoPlayer({ ipId, score }: IPVideoPlayerProps) {
  const { currentSrc, state } = useVideoState(ipId, score)

  return (
    <div className="glass-light rounded-glass p-4 text-white">
      <p className="mb-2 text-sm">IP 状态：{state}</p>
      <video className="aspect-video w-full rounded-glass object-cover" muted loop playsInline src={currentSrc} />
    </div>
  )
}

export default IPVideoPlayer
