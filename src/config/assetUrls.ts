const DEV_BASE = '/assets'
const PROD_BASE = '/remote-assets'

const ASSET_FILES = {
  'D-01.mp4': 'D-01.mp4',
  'D-03.mp4': 'D-03.mp4',
  'D-04.mp4': 'D-04.mp4',
  'E-01.mp4': 'E-01.mp4',
  'E-03.mp4': 'E-03.mp4',
  'E-04.mp4': 'E-04.mp4',
  'H-01.mp4': 'H-01.mp4',
  'P-01.mp4': 'P-01.mp4',
  'P-03.mp4': 'P-03.mp4',
  'P-04.mp4': 'P-04.mp4',
  'R-01.mp4': 'R-01.mp4',
  'R-03.mp4': 'R-03.mp4',
  'R-04.mp4': 'R-04.mp4',
  'S-01.mp4': 'S-01.mp4',
  'S-03.mp4': 'S-03.mp4',
  'S-04.mp4': 'S-04.mp4',
  'T-01.mp4': 'T-01.mp4',
  'T-02.mp4': 'T-02.mp4',
  'T-03.mp4': 'T-03.mp4',
  'T-04.mp4': 'T-04.mp4',
  'T-05.mp4': 'T-05.mp4',
  '图一.png': '%E5%9B%BE%E4%B8%80.png',
  '图二.png': '%E5%9B%BE%E4%BA%8C.png',
  '图三.png': '%E5%9B%BE%E4%B8%89.png',
  '图四.png': '%E5%9B%BE%E5%9B%9B.png',
  '图五.png': '%E5%9B%BE%E4%BA%94.png',
  '首页图.png': '%E9%A6%96%E9%A1%B5%E5%9B%BE.png',
} as const

export const ASSET_BASE = import.meta.env.DEV ? DEV_BASE : PROD_BASE

export function assetUrl(path: string): string {
  const mappedPath = ASSET_FILES[path as keyof typeof ASSET_FILES] ?? encodeURIComponent(path)
  return `${ASSET_BASE}/${mappedPath}`
}
