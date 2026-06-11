const fs = require('fs')
const path = require('path')

const playwright = require('C:/Users/32525/AppData/Local/npm-cache/_npx/423231821c231c73/node_modules/playwright')

const outputDir = path.join(process.cwd(), 'output', 'playwright')
const downloadDir = path.join(outputDir, 'downloads')

async function run() {
  fs.mkdirSync(downloadDir, { recursive: true })

  const browser = await playwright.chromium.launch({
    headless: true,
    executablePath: 'C:/Users/32525/AppData/Local/ms-playwright/chromium-1223/chrome-win64/chrome.exe',
  })

  const context = await browser.newContext({
    viewport: { width: 1600, height: 980 },
    acceptDownloads: true,
  })
  const page = await context.newPage()

  await page.addInitScript(() => {
    localStorage.setItem('token', 'mock-token-codex')
    localStorage.setItem('xinxiaogan_username', 'codex')
  })

  const report = {
    pageLoaded: false,
    saveFlow: null,
    historyFilter: null,
    exportFlow: null,
  }

  await page.goto('http://127.0.0.1:4173/profile', { waitUntil: 'networkidle' })
  report.pageLoaded = (await page.title()) === '小心肝 · 智能健康陪伴'

  await page.screenshot({
    path: path.join(outputDir, 'm10-profile-audit-page.png'),
    fullPage: true,
  })

  const nicknameInput = page.locator('input#昵称').first()
  await nicknameInput.fill('小洋裙Pro')
  await page.getByRole('button', { name: '保存资料' }).click()
  await page.waitForTimeout(400)

  report.saveFlow = {
    nicknameValue: await nicknameInput.inputValue(),
    toast: await page.locator('text=资料已保存').first().textContent().catch(() => null),
  }

  await page.getByRole('button', { name: /饮食/ }).first().click()
  await page.waitForTimeout(200)

  const visibleRows = await page.locator('text=饮食记录').allTextContents()
  const sleepRows = await page.locator('text=作息记录').allTextContents()
  report.historyFilter = {
    visibleDietRows: visibleRows.length,
    visibleSleepRows: sleepRows.length,
    counterText: await page.locator('text=/当前显示/').first().textContent().catch(() => null),
  }

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: '导出 CSV' }).click(),
  ])
  const downloadPath = path.join(downloadDir, 'm10-profile-export.csv')
  await download.saveAs(downloadPath)

  report.exportFlow = {
    suggestedFilename: download.suggestedFilename(),
    savedFile: fs.existsSync(downloadPath),
    fileSize: fs.existsSync(downloadPath) ? fs.statSync(downloadPath).size : 0,
    toast: await page.locator('text=CSV 已导出到本地下载。').first().textContent().catch(() => null),
  }

  fs.writeFileSync(
    path.join(outputDir, 'm10-profile-verification.json'),
    JSON.stringify(report, null, 2),
    'utf8',
  )

  await browser.close()
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
