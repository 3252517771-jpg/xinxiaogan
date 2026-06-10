import type { User, UserProfile } from '@/types/user'

export const mockUser: User = {
  id: 'mock-user',
  username: 'xiaoyangqun',
  is_admin: false,
  created_at: '2026-06-10T00:00:00+08:00',
  updated_at: '2026-06-10T00:00:00+08:00',
}

export const mockUserProfile: UserProfile = {
  id: 'mock-profile',
  user_id: 'mock-user',
  nickname: '小洋裙',
  age: null,
  gender: null,
  height_cm: null,
  weight_kg: null,
  timezone: 'Asia/Shanghai',
}
