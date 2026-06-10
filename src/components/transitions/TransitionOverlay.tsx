interface TransitionOverlayProps {
  visible?: boolean
}

function TransitionOverlay({ visible = false }: TransitionOverlayProps) {
  return visible ? <div className="fixed inset-0 z-30 bg-black/50" /> : null
}

export default TransitionOverlay
