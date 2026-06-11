export interface IPCharacter {
  id: string
  name: string
  emoji: string
  dimensionColor: string
  glowColor: string
  sceneImage: string
  transitionVideo: string
  goodVideo: string
  badVideo: string
  feedbackVideo: string
}

export type VideoState = 'loading' | 'good' | 'calm' | 'bad' | 'feedback'
export type ScoreLevel = 'excellent' | 'good' | 'average' | 'poor'

export interface VideoScene {
  state: VideoState
  source: string
  poster: string
  loop: boolean
  freezeOnEnd: boolean
  filterClassName?: string
}
