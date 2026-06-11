import { createContext, createElement, useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { login as loginRequest, register as registerRequest } from '@/services/auth'
import type { LoginPayload, RegisterPayload, TokenResponse } from '@/services/auth'

const TOKEN_STORAGE_KEY = 'token'
const USERNAME_STORAGE_KEY = 'xinxiaogan_username'

export interface AuthState {
  token: string | null
  username: string | null
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthState | null>(null)

function readStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

function readStoredUsername(): string | null {
  return localStorage.getItem(USERNAME_STORAGE_KEY)
}

function persistToken(response: TokenResponse): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, response.access_token)
  localStorage.setItem(USERNAME_STORAGE_KEY, response.username)
  localStorage.removeItem('xinxiaogan_mock_token')
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() => readStoredToken())
  const [username, setUsername] = useState<string | null>(() => readStoredUsername())

  const applyAuthResponse = useCallback((response: TokenResponse) => {
    persistToken(response)
    setToken(response.access_token)
    setUsername(response.username)
  }, [])

  const login = useCallback(
    async (payload: LoginPayload) => {
      const response = await loginRequest(payload)
      applyAuthResponse(response)
    },
    [applyAuthResponse],
  )

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const response = await registerRequest(payload)
      applyAuthResponse(response)
    },
    [applyAuthResponse],
  )

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    localStorage.removeItem(USERNAME_STORAGE_KEY)
    localStorage.removeItem('xinxiaogan_mock_token')
    setToken(null)
    setUsername(null)
  }, [])

  const value = useMemo<AuthState>(
    () => ({
      token,
      username,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [login, logout, register, token, username],
  )

  return createElement(AuthContext.Provider, { value }, children)
}
