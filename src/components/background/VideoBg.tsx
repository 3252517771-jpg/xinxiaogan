import { assetUrl } from '@/config/assetUrls'

interface VideoBgProps {
  src: string
  poster?: string
}

function VideoBg({ src, poster }: VideoBgProps) {
  return <video className="h-full w-full object-cover" muted loop playsInline poster={poster ? assetUrl(poster) : undefined} src={assetUrl(src)} />
}

export default VideoBg
