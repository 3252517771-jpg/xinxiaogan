interface ToastProps {
  message: string
}

function Toast({ message }: ToastProps) {
  return <div className="rounded-glass bg-white px-4 py-2 text-sm text-forest-deep shadow-lg">{message}</div>
}

export default Toast
