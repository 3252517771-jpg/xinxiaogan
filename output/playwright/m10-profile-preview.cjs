const path = require('path')

const playwright = require('C:/Users/32525/AppData/Local/npm-cache/_npx/423231821c231c73/node_modules/playwright')

async function run() {
  const browser = await playwright.chromium.launch({
    headless: true,
    executablePath: 'C:/Users/32525/AppData/Local/ms-playwright/chromium-1223/chrome-win64/chrome.exe',
  })

  const context = await browser.newContext({
    viewport: { width: 1600, height: 980 },
  })
  const page = await context.newPage()

  await page.addInitScript(() => {
    localStorage.setItem('token', 'mock-token-codex')
    localStorage.setItem('xinxiaogan_username', 'codex')
  })

  await page.goto('http://127.0.0.1:4173/profile', { waitUntil: 'networkidle' })
  await page.screenshot({
    path: path.join(process.cwd(), 'output', 'playwright', 'm10-profile-preview.png'),
    fullPage: true,
  })

  await browser.close()
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
