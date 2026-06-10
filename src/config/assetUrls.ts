const CDN_BASE = 'http://tgan02frv.hd-bkt.clouddn.com'
const DEV_BASE = '/assets'

export const ASSET_BASE = import.meta.env.DEV ? DEV_BASE : CDN_BASE

export function assetUrl(path: string): string {
  return `${ASSET_BASE}/${encodeURIComponent(path)}`
}
