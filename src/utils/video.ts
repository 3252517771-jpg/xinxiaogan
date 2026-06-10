import { assetUrl } from '@/config/assetUrls'

export function videoUrl(fileName: string): string {
  return assetUrl(fileName)
}
