import type { LoginPayload, RegisterPayload, TokenResponse } from '@/services/auth'
import type { UserProfile } from '@/types/user'
import {
  mockBehaviorSummary,
  getMockHistory,
  mockDailyScore,
  mockHealthRecords,
  mockRiskMutationResponse,
  mockTrendPoints,
  type HealthDimension,
} from './health.mock'
import { mockUser, mockUserProfile } from './user.mock'
import { mockBehaviorHighlights } from './risk.mock'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface MockRequestInput {
  endpoint: string
  method: HttpMethod
  body: unknown
}

interface AdminVerifyResponse {
  ok: boolean
  mode: 'admin'
}

interface MutationResponse<T> {
  ok: boolean
  score: number
  record: T
  behavior_tags: typeof mockBehaviorHighlights
  ai_advice: string
}

const MOCK_DELAY_MS = 120
const HEALTH_DIMENSIONS: HealthDimension[] = ['sleep', 'diet', 'exercise', 'stress', 'risk']

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms)
  })
}

function parseEndpoint(endpoint: string): URL {
  return new URL(endpoint, 'http://xinxiaogan.mock')
}

function createTokenResponse(username: string): TokenResponse {
  return {
    access_token: `mock-token-${username}`,
    token_type: 'bearer',
    username,
  }
}

function readPayload<T extends object>(body: unknown): Partial<T> {
  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as Partial<T>
    } catch {
      return {}
    }
  }

  if (body && typeof body === 'object') {
    return body as Partial<T>
  }

  return {}
}

function isHealthDimension(value: string): value is HealthDimension {
  return HEALTH_DIMENSIONS.includes(value as HealthDimension)
}

function mutateHealthRecord<T extends { id: string; score: number }>(
  record: T,
  body: unknown,
): MutationResponse<T> {
  const payload = readPayload<T>(body)
  const nextRecord = {
    ...record,
    ...payload,
    id: `${record.id}-submitted`,
  }

  return {
    ok: true,
    score: nextRecord.score,
    record: nextRecord,
    behavior_tags: [],
    ai_advice: '今天先把节奏稳住一点，按当前记录继续微调，比一次改很多更容易坚持。',
  }
}

export async function mockRequest<T>({ endpoint, method, body }: MockRequestInput): Promise<T> {
  await delay(MOCK_DELAY_MS)

  const url = parseEndpoint(endpoint)
  const path = url.pathname

  if (path === '/auth/login' && method === 'POST') {
    const payload = readPayload<LoginPayload>(body)
    return createTokenResponse(payload.username ?? mockUser.username) as T
  }

  if (path === '/auth/register' && method === 'POST') {
    const payload = readPayload<RegisterPayload>(body)
    return createTokenResponse(payload.username ?? mockUser.username) as T
  }

  if (path.startsWith('/health/')) {
    const dimension = path.replace('/health/', '')

    if (isHealthDimension(dimension) && method === 'GET') {
      return mockHealthRecords[dimension] as T
    }

    if (isHealthDimension(dimension) && method === 'POST') {
      if (dimension === 'risk') {
        const payload = readPayload<typeof mockRiskMutationResponse.record>(body)
        return {
          ...mockRiskMutationResponse,
          score:
            payload.systolic_bp && payload.systolic_bp >= 145
              ? 58
              : mockRiskMutationResponse.score,
          risk_level: payload.systolic_bp && payload.systolic_bp >= 145 ? 'high' : 'low',
          risk_probability: payload.systolic_bp && payload.systolic_bp >= 145 ? 0.873 : 0.912,
          risk_alert: Boolean(payload.systolic_bp && payload.systolic_bp >= 145),
          record: {
            ...mockRiskMutationResponse.record,
            ...payload,
            id: `${mockRiskMutationResponse.record.id}-submitted`,
            score: payload.systolic_bp && payload.systolic_bp >= 145 ? 58 : mockRiskMutationResponse.score,
          },
          behavior_tags:
            payload.systolic_bp && payload.systolic_bp >= 145
              ? [
                  {
                    id: 'abnormal_sign',
                    dimension: 'risk',
                    label: '某项指标偏高，建议持续关注',
                  },
                ]
              : [],
          ai_advice:
            payload.systolic_bp && payload.systolic_bp >= 145
              ? '这次体征有点往高风险方向偏了，先尽快复测一次，并把最近作息和饮食一起收紧。'
              : '当前体征比较稳定，继续规律记录，优先关注一周内的连续变化。',
        } as T
      }
      return mutateHealthRecord(mockHealthRecords[dimension], body) as T
    }
  }

  if (path === '/behavior/summary' && method === 'GET') {
    return mockBehaviorSummary as T
  }

  if (path === '/health/overall' && method === 'GET') {
    return mockDailyScore as T
  }

  if (path === '/health/trend' && method === 'GET') {
    const days = Number(url.searchParams.get('days') ?? mockTrendPoints.length)
    return mockTrendPoints.slice(-days) as T
  }

  if (path === '/health/history' && method === 'GET') {
    const dimension = url.searchParams.get('dimension') ?? 'all'
    const page = Number(url.searchParams.get('page') ?? 1)
    const historyDimension = isHealthDimension(dimension) ? dimension : 'all'
    return getMockHistory(historyDimension, page) as T
  }

  if (path === '/user/profile' && method === 'GET') {
    return mockUserProfile as T
  }

  if (path === '/user/profile' && method === 'PUT') {
    const payload = readPayload<UserProfile>(body)
    return { ...mockUserProfile, ...payload } as T
  }

  if (path === '/admin/verify' && method === 'POST') {
    const response: AdminVerifyResponse = { ok: true, mode: 'admin' }
    return response as T
  }

  throw new Error(`Mock endpoint not implemented: ${method} ${path}`)
}
