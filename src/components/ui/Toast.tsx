interface ToastProps {
  message: string
  tone?: 'success' | 'info'
}

function Toast({ message, tone = 'success' }: ToastProps) {
  const toneClass = tone === 'success' ? 'border-dimension-exercise/40' : 'border-dimension-sleep/40'

  return (
    <div className={`glass-medium rounded-glass border px-4 py-3 text-sm text-white shadow-[0_18px_48px_rgba(0,0,0,0.24)] ${toneClass}`}>
      {message}
    </div>
  )
}

export default Toast
