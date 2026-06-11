import { createContext, createElement, useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { login as loginRequest, register as registerRequest } from '@/services/auth'
import type { LoginPayload, RegisterPayload, TokenResponse } from '@/services/auth'

const TOKEN_STORAGE_KEY = 'token'
const USERNAME_STORAGE_KEY = 'xinxiaogan_username'

export interface AuthState {
  token: string | null
  username: string | null
  isCheckingAuth: boolean
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

function clearStoredAuth(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  localStorage.removeItem(USERNAME_STORAGE_KEY)
  localStorage.removeItem('xinxiaogan_mock_token')
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() => readStoredToken())
  const [username, setUsername] = useState<string | null>(() => readStoredUsername())
  const [isCheckingAuth, setIsCheckingAuth] = useState(() => Boolean(readStoredToken()))

  const applyAuthResponse = useCallback((response: TokenResponse) => {
    persistToken(response)
    setToken(response.access_token)
    setUsername(response.username)
    setIsCheckingAuth(false)
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
    clearStoredAuth()
    setToken(null)
    setUsername(null)
    setIsCheckingAuth(false)
  }, [])

  useEffect(() => {
    function handleUnauthorized() {
      clearStoredAuth()
      setToken(null)
      setUsername(null)
      setIsCheckingAuth(false)
    }

    window.addEventListener('xinxiaogan:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('xinxiaogan:unauthorized', handleUnauthorized)
  }, [])

  useEffect(() => {
    if (!token) {
      setIsCheckingAuth(false)
      return
    }

    let isMounted = true
    setIsCheckingAuth(true)

    async function verifyToken() {
      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!isMounted) {
        return
      }

      if (response.ok) {
        setIsCheckingAuth(false)
        return
      }

      clearStoredAuth()
      setToken(null)
      setUsername(null)
      setIsCheckingAuth(false)
    }

    void verifyToken().catch(() => {
      if (!isMounted) {
        return
      }

      clearStoredAuth()
      setToken(null)
      setUsername(null)
      setIsCheckingAuth(false)
    })

    return () => {
      isMounted = false
    }
  }, [token])

  const value = useMemo<AuthState>(
    () => ({
      token,
      username,
      isCheckingAuth,
      isAuthenticated: Boolean(token) && !isCheckingAuth,
      login,
      register,
      logout,
    }),
    [isCheckingAuth, login, logout, register, token, username],
  )

  return createElement(AuthContext.Provider, { value }, children)
}
