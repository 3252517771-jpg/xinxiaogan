import { writeFile } from 'node:fs/promises'
import { createServer } from 'vite'

const server = await createServer({
  configFile: 'vite.config.ts',
  server: { middlewareMode: true },
  appType: 'custom',
})

try {
  const mod = await server.ssrLoadModule('/src/services/api.ts')
  const endpoints = [
    ['POST', '/auth/register', { username: 'm5-user', password: 'pass', confirm_password: 'pass' }],
    ['POST', '/auth/login', { username: 'm5-user', password: 'pass' }],
    ['GET', '/health/sleep?date=2026-06-10'],
    ['POST', '/health/sleep', { sleep_time: '22:50', wake_time: '07:10', sleep_quality: 5, interruption_count: 0, score: 91 }],
    ['GET', '/health/diet?date=2026-06-10'],
    ['POST', '/health/diet', { meal_type: 'dinner', food_description: 'fish and greens', calories: 620, score: 82 }],
    ['GET', '/health/exercise?date=2026-06-10'],
    ['POST', '/health/exercise', { exercise_type: 'walking', duration_min: 40, intensity: 'medium', steps: 9000, score: 86 }],
    ['GET', '/health/stress?date=2026-06-10'],
    ['POST', '/health/stress', { stress_level: 3, anxiety_level: 2, emotion_tag: 'calm', score: 90 }],
    ['GET', '/health/risk?date=2026-06-10'],
    ['POST', '/health/risk', { systolic_bp: 116, diastolic_bp: 74, heart_rate: 70, blood_glucose: 5, waist_cm: 77, cholesterol: 4.4, score: 90 }],
    ['GET', '/health/overall?date=2026-06-10'],
    ['GET', '/health/trend?dimension=all&days=7'],
    ['GET', '/user/profile'],
    ['PUT', '/user/profile', { nickname: 'M5 audit user', timezone: 'Asia/Shanghai' }],
    ['GET', '/health/history?dimension=sleep&page=1'],
    ['POST', '/admin/verify', { password: 'mock-admin' }],
  ]

  const audit = []
  for (const [method, endpoint, body] of endpoints) {
    try {
      const data = await mod.request(endpoint, {
        method,
        ...(body ? { body: JSON.stringify(body) } : {}),
      })
      audit.push({
        method,
        endpoint,
        ok: true,
        shape: Array.isArray(data) ? `array:${data.length}` : Object.keys(data).sort().join(','),
      })
    } catch (error) {
      audit.push({
        method,
        endpoint,
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  const report = {
    checkedAt: new Date().toISOString(),
    runner: 'vite.ssrLoadModule(/src/services/api.ts)',
    allPassed: audit.every((item) => item.ok),
    endpoints: audit,
  }

  await writeFile(
    'output/playwright/m5-mock-api-verification.json',
    `${JSON.stringify(report, null, 2)}\n`,
    'utf8',
  )
  console.log(JSON.stringify(report, null, 2))
  process.exitCode = report.allPassed ? 0 : 1
} finally {
  await server.close()
}
