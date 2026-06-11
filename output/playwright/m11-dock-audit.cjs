const fs = require('fs')
const path = require('path')

const playwright = require('C:/Users/32525/AppData/Local/npm-cache/_npx/423231821c231c73/node_modules/playwright')

const outputDir = path.join(process.cwd(), 'output', 'playwright')

const pages = [
  { key: 'sleep', route: '/sleep', title: '作息分析', icon: '息' },
  { key: 'diet', route: '/diet', title: '饮食分析', icon: '食' },
  { key: 'exercise', route: '/exercise', title: '运动分析', icon: '动' },
  { key: 'stress', route: '/stress', title: '压力分析', icon: '压' },
  { key: 'risk', route: '/health-risk', title: '健康风险', icon: '险' },
]

async function captureDockState(page, name) {
  await page.screenshot({
    path: path.join(outputDir, `m11-${name}.png`),
    fullPage: true,
  })

  const dockPanel = page.locator('.dock-panel').first()
  const dockItems = page.locator('.dock-item')

  return {
    dockVisible: await dockPanel.isVisible(),
    dockItemCount: await dockItems.count(),
    activeIndex: await page.locator('.dock-item.is-active').evaluateAll((nodes) =>
      nodes.map((node) => Array.from(node.parentElement?.children ?? []).indexOf(node)),
    ),
  }
}

async function run() {
  fs.mkdirSync(outputDir, { recursive: true })

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

  const report = {
    checkedAt: new Date().toISOString(),
    baseUrl: 'http://127.0.0.1:4173',
    pages: {},
    routeSwitches: [],
  }

  for (const item of pages) {
    await page.goto(`http://127.0.0.1:4173${item.route}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(300)

    const pageState = await captureDockState(page, `${item.key}-dock`)
    pageState.pathname = new URL(page.url()).pathname
    pageState.header = await page.locator('h1').first().textContent()
    report.pages[item.key] = pageState
    fs.writeFileSync(
      path.join(outputDir, 'm11-dock-verification.json'),
      JSON.stringify(report, null, 2),
      'utf8',
    )
  }

  await page.goto('http://127.0.0.1:4173/sleep', { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)

  for (const [index, item] of pages.slice(1).entries()) {
    await page.locator('.dock-item').nth(index + 1).click()
    await page.waitForTimeout(450)

    report.routeSwitches.push({
      target: item.key,
      pathname: new URL(page.url()).pathname,
      activeCount: await page.locator('.dock-item.is-active').count(),
      activeLabelVisible: await page.locator('.dock-item.is-active').first().isVisible(),
      header: await page.locator('h1').first().textContent(),
    })

    fs.writeFileSync(
      path.join(outputDir, 'm11-dock-verification.json'),
      JSON.stringify(report, null, 2),
      'utf8',
    )
  }

  fs.writeFileSync(
    path.join(outputDir, 'm11-dock-verification.json'),
    JSON.stringify(report, null, 2),
    'utf8',
  )

  await browser.close()
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
