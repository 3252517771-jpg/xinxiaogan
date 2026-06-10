interface StarRatingProps {
  value: number
}

function StarRating({ value }: StarRatingProps) {
  return <div className="text-sm text-white/80">{'★'.repeat(value)}{'☆'.repeat(Math.max(0, 5 - value))}</div>
}

export default StarRating
