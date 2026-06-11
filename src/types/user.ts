export interface User {
  id: string
  username: string
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  nickname: string | null
  age: number | null
  gender: 'male' | 'female' | 'other' | null
  height_cm: number | null
  weight_kg: number | null
  timezone: string
  wechat_sendkey?: string | null
  has_wechat_sendkey?: boolean
  enable_ai_advice?: boolean
  enable_push?: boolean
}
