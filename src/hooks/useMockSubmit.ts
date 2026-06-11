import { useState } from 'react'
import { request } from '@/services/api'

interface MutationResponse<T> {
  ok: boolean
  score: number
  record: T
}

export function useMockSubmit<TPayload extends object, TRecord extends object>(endpoint: string) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function submit(payload: TPayload) {
    setIsSubmitting(true)
    setMessage(null)
    setError(null)

    try {
      const response = await request<MutationResponse<TRecord>>(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      setMessage(`已记录，当前评分 ${response.score}`)
      return response
    } catch (submitError) {
      const nextError = submitError instanceof Error ? submitError.message : '提交失败'
      setError(nextError)
      return null
    } finally {
      setIsSubmitting(false)
    }
  }

  return { isSubmitting, message, error, submit }
}
