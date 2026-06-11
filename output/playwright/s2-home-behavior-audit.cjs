const { chromium } = require('playwright')
const fs = require('node:fs')
const path = require('node:path')

async function main() {
  const outputDir = path.join(process.cwd(), 'output', 'playwright')
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
  const username = `s2_ui_${Date.now()}`
  const password = 's2-password-123'
  const evidence = { username, page: '/', checks: [] }

  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: '还没有账号？注册' }).click()
  await page.getByLabel('用户名').fill(username)
  await page.getByLabel('密码', { exact: true }).fill(password)
  await page.getByLabel('确认密码').fill(password)
  await page.getByRole('button', { name: '注册并登录' }).click()
  await page.waitForSelector('text=个人主页', { timeout: 10000 })
  await page.waitForLoadState('networkidle')

  await page.evaluate(() => {
    window.scrollTo({ top: document.body.scrollHeight * 0.55, behavior: 'instant' })
  })
  await page.waitForTimeout(800)

  const behaviorSection = page.locator('section[aria-label="行为识别标签"]')
  await behaviorSection.waitFor({ timeout: 10000 })
  const sectionText = await behaviorSection.innerText()
  const screenshotPath = path.join(outputDir, 's2-home-behavior-tags.png')
  await behaviorSection.screenshot({ path: screenshotPath })

  evidence.checks.push({
    name: 'behavior section visible below trend',
    visible: await behaviorSection.isVisible(),
    includesSleep: sectionText.includes('作息') && sectionText.includes('近期熬夜较多'),
    includesDiet: sectionText.includes('饮食') && sectionText.includes('三餐记录不完整'),
    includesExercise: sectionText.includes('运动') && sectionText.includes('近期运动偏少'),
    includesStress: sectionText.includes('压力') && sectionText.includes('最近压力较大'),
    includesRisk: sectionText.includes('风险') && sectionText.includes('某项指标偏高'),
  })

  evidence.screenshot = screenshotPath
  evidence.passed = evidence.checks.every((item) =>
    item.visible &&
    item.includesSleep &&
    item.includesDiet &&
    item.includesExercise &&
    item.includesStress &&
    item.includesRisk
  )

  fs.writeFileSync(
    path.join(outputDir, 's2-home-behavior-verification.json'),
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
