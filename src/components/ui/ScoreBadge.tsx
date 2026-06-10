import { getScoreLevel } from '@/utils/score'

interface ScoreBadgeProps {
  score: number
  label?: string
}

function ScoreBadge({ score, label = 'score' }: ScoreBadgeProps) {
  const level = getScoreLevel(score)

  return (
    <span className="inline-flex items-center gap-2 rounded-pill border border-white/16 bg-white/12 px-3 py-1 text-sm text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)]">
      <span className="h-2 w-2 rounded-full bg-dimension-exercise" />
      <span className="text-white/50">{label}</span>
      <strong>{score}</strong>
      <span className="text-white/55">{level}</span>
    </span>
  )
}

export default ScoreBadge
