const BASE_URL = import.meta.env.DEV ? '/api' : '/api'

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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
    throw new Error(await response.text())
  }

  return response.json() as Promise<T>
}
