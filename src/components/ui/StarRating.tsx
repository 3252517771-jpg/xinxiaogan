interface StarRatingProps {
  value: number
  max?: number
}

function StarRating({ value, max = 5 }: StarRatingProps) {
  return (
    <div className="flex gap-1" aria-label={`${value}/${max}`}>
      {Array.from({ length: max }, (_, index) => (
        <span className={index < value ? 'text-dimension-risk' : 'text-white/18'} key={index}>
          ★
        </span>
      ))}
    </div>
  )
}

export default StarRating
