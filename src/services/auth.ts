export interface LoginPayload {
  username: string
  password: string
}

export interface RegisterPayload extends LoginPayload {
  confirm_password: string
}

export interface TokenResponse {
  access_token: string
  token_type: 'bearer'
  username: string
}

export async function mockLogin(payload: LoginPayload): Promise<TokenResponse> {
  return {
    access_token: `mock-token-${payload.username}`,
    token_type: 'bearer',
    username: payload.username,
  }
}
