import type { LayoutConfig } from '@/types/layout'

export function serializeLayout(configs: LayoutConfig[]): string {
  return JSON.stringify(configs, null, 2)
}
