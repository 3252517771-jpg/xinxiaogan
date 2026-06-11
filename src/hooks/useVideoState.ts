import { useEffect, useMemo, useRef, useState } from 'react'
import { IP_CHARACTERS } from '@/config/constants'
import { assetUrl } from '@/config/assetUrls'
import type { VideoScene, VideoState } from '@/types/ip'

interface VideoStateController {
  activeState: VideoState
  scene: VideoScene
  triggerFeedback: () => void
  handleVideoEnded: () => void
}

function resolveScoreState(score: number): VideoState {
  if (score >= 80) {
    return 'good'
  }

  if (score >= 60) {
    return 'calm'
  }

  return 'bad'
}

const LOOP_PLAYBACK_CYCLE_MS = 10000

export function useVideoState(ipId: string, score: number): VideoStateController {
  const fallbackIp = IP_CHARACTERS.sleep
  if (!fallbackIp) {
    throw new Error('Missing sleep IP character config')
  }

  const ip = IP_CHARACTERS[ipId] ?? fallbackIp
  const scoreState = resolveScoreState(score)
  const [activeState, setActiveState] = useState<VideoState>(scoreState)
  const feedbackRestoreRef = useRef<VideoState>(scoreState)

  useEffect(() => {
    feedbackRestoreRef.current = scoreState
    setActiveState((currentState) => (currentState === 'feedback' ? currentState : scoreState))
  }, [scoreState])

  const scene = useMemo<VideoScene>(() => {
    const poster = assetUrl(ip.sceneImage)

    if (activeState === 'feedback') {
      return {
        state: activeState,
        source: assetUrl(ip.feedbackVideo),
        poster,
        loop: false,
        freezeOnEnd: false,
      }
    }

    if (activeState === 'bad') {
      return {
        state: activeState,
        source: assetUrl(ip.badVideo),
        poster,
        loop: false,
        freezeOnEnd: true,
      }
    }

    return {
      state: activeState,
      source: assetUrl(ip.goodVideo),
      poster,
      loop: false,
      freezeOnEnd: false,
      cycleDurationMs: LOOP_PLAYBACK_CYCLE_MS,
      filterClassName: activeState === 'calm' ? 'ip-video--calm' : undefined,
    }
  }, [activeState, ip.badVideo, ip.feedbackVideo, ip.goodVideo, ip.sceneImage])

  function triggerFeedback() {
    feedbackRestoreRef.current = resolveScoreState(score)
    setActiveState('feedback')
  }

  function handleVideoEnded() {
    if (activeState === 'feedback') {
      setActiveState(feedbackRestoreRef.current)
    }
  }

  return {
    activeState,
    scene,
    triggerFeedback,
    handleVideoEnded,
  }
}
