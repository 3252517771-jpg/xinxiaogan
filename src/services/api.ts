import { mockRequest } from '@/services/mock/api.mock'

const BASE_URL = import.meta.env.DEV ? '/api' : '/api'
const USE_MOCK_API = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API === 'true'

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const method = (options.method ?? 'GET').toUpperCase()

  if (USE_MOCK_API) {
    return mockRequest<T>({
      endpoint,
      method: method as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
      body: options.body,
    })
  }

  const token = localStorage.getItem('token')
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    let message = errorText
    try {
      const errorBody = JSON.parse(errorText) as { detail?: string; message?: string }
      message = errorBody.detail ?? errorBody.message ?? errorText
    } catch {
      message = errorText
    }

    if (response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('xinxiaogan_username')
      localStorage.removeItem('xinxiaogan_mock_token')
      window.dispatchEvent(new CustomEvent('xinxiaogan:unauthorized'))
    }

    throw new Error(message)
  }

  return response.json() as Promise<T>
}
