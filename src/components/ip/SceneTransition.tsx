interface SceneTransitionProps {
  isActive?: boolean
}

function SceneTransition({ isActive = false }: SceneTransitionProps) {
  return isActive ? <div className="fixed inset-0 z-20 bg-forest-deep/80" /> : null
}

export default SceneTransition
