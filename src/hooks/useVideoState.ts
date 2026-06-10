import { useMemo } from 'react'
import { IP_CHARACTERS } from '@/config/constants'
import { assetUrl } from '@/config/assetUrls'
import type { VideoState } from '@/types/ip'

export function useVideoState(ipId: string, score: number) {
  return useMemo(() => {
    const fallbackIp = IP_CHARACTERS.sleep
    if (!fallbackIp) {
      throw new Error('Missing sleep IP character config')
    }

    const ip = IP_CHARACTERS[ipId] ?? fallbackIp
    const state: VideoState = score >= 80 ? 'good' : score >= 60 ? 'calm' : 'bad'
    const source = score >= 60 ? ip.goodVideo : ip.badVideo

    return {
      state,
      currentSrc: assetUrl(source),
      feedbackSrc: assetUrl(ip.feedbackVideo),
    }
  }, [ipId, score])
}
