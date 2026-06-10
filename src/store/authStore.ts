export interface AuthState {
  token: string | null
  username: string | null
}

export const initialAuthState: AuthState = {
  token: null,
  username: null,
}
