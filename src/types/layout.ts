export interface LayoutConfig {
  id: string
  user_id: string
  page: string
  element_selector: string
  styles_json: Record<string, string | number>
  version: number
  is_active: boolean
}
