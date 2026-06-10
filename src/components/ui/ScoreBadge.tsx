import { getScoreLevel } from '@/utils/score'

interface ScoreBadgeProps {
  score: number
}

function ScoreBadge({ score }: ScoreBadgeProps) {
  return (
    <span className="rounded-pill bg-white/15 px-3 py-1 text-sm text-white">
      {score} · {getScoreLevel(score)}
    </span>
  )
}

export default ScoreBadge
