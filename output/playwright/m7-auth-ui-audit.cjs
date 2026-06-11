const { chromium } = require('playwright')
const fs = require('node:fs')
const path = require('node:path')

async function main() {
  const outputDir = path.join(process.cwd(), 'output', 'playwright')
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
  const username = `m7_ui_${Date.now()}`
  const password = 'm7-password-123'
  const evidence = { username, steps: [] }

  await page.goto('http://127.0.0.1:5173/sleep', { waitUntil: 'networkidle' })
  evidence.steps.push({
    name: 'protected route redirects while logged out',
    url: page.url(),
    loginVisible: await page.getByRole('heading', { name: '登录' }).isVisible(),
  })
  await page.screenshot({ path: path.join(outputDir, 'm7-auth-locked-home.png'), fullPage: true })

  await page.getByRole('button', { name: '还没有账号？注册' }).click()
  await page.getByLabel('用户名').fill(username)
  await page.getByLabel('密码', { exact: true }).fill(password)
  await page.getByLabel('确认密码').fill(password)
  await page.getByRole('button', { name: '注册并登录' }).click()
  await page.waitForSelector('text=个人主页', { timeout: 10000 })
  await page.waitForLoadState('networkidle')

  const token = await page.evaluate(() => localStorage.getItem('token'))
  evidence.steps.push({
    name: 'register stores jwt and unlocks homepage',
    tokenPresent: typeof token === 'string' && token.length > 20,
    personalNavVisible: await page.getByText('个人主页').first().isVisible(),
  })
  await page.screenshot({ path: path.join(outputDir, 'm7-auth-unlocked-home.png'), fullPage: true })

  await page.goto('http://127.0.0.1:5173/sleep', { waitUntil: 'networkidle' })
  evidence.steps.push({
    name: 'protected route opens after jwt exists',
    url: page.url(),
    sleepPageVisible: await page.getByText('作息分析').first().isVisible(),
  })
  await page.screenshot({ path: path.join(outputDir, 'm7-auth-unlocked-sleep.png'), fullPage: true })

  evidence.passed = evidence.steps.every((step) => {
    if (step.name === 'protected route redirects while logged out') {
      return step.url === 'http://127.0.0.1:5173/' && step.loginVisible
    }
    if (step.name === 'register stores jwt and unlocks homepage') {
      return step.tokenPresent && step.personalNavVisible
    }
    if (step.name === 'protected route opens after jwt exists') {
      return step.url === 'http://127.0.0.1:5173/sleep' && step.sleepPageVisible
    }
    return false
  })

  fs.writeFileSync(
    path.join(outputDir, 'm7-auth-ui-verification.json'),
    JSON.stringify(evidence, null, 2),
    'utf8',
  )

  await browser.close()

  if (!evidence.passed) {
    console.error(JSON.stringify(evidence, null, 2))
    process.exit(1)
  }

  console.log(JSON.stringify(evidence, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
