const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')

const outputDir = path.resolve(__dirname)
const baseUrl = 'http://127.0.0.1:5173'

const pages = [
  { key: 'sleep', path: '/sleep', title: '作息分析', layout: 'magic-bento-detail', fields: ['入睡时间', '起床时间', '中断次数', '睡眠质量'] },
  { key: 'diet', path: '/diet', title: '饮食分析', layout: 'three-column-detail', fields: ['餐次', '食物描述', '热量'] },
  { key: 'exercise', path: '/exercise', title: '运动分析', layout: 'magic-bento-detail', fields: ['运动类型', '时长', '强度', '步数', '心率'] },
  { key: 'stress', path: '/stress', title: '压力分析', layout: 'three-column-detail', fields: ['压力自评', '焦虑自评', '情绪标签'] },
  { key: 'risk', path: '/health-risk', title: '健康风险', layout: 'three-column-detail', fields: ['收缩压', '舒张压', '静息心率', '血糖值', '腰围', '胆固醇'] },
]

async function main() {
  fs.mkdirSync(outputDir, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })

  await page.goto(baseUrl, { waitUntil: 'networkidle' })
  await page.evaluate(() => {
    localStorage.setItem('token', 'm8-audit-token')
    localStorage.setItem('xinxiaogan_username', 'm8-audit')
  })

  const results = []

  for (const item of pages) {
    await page.goto(`${baseUrl}${item.path}`, { waitUntil: 'networkidle' })
    await page.waitForSelector(`text=${item.title}`, { timeout: 5000 })

    const layoutExists = await page.locator(`[data-layout="${item.layout}"]`).count()
    const centerSpaceExists = item.layout === 'three-column-detail'
      ? await page.locator('[data-layout-zone="ip-scene-space"]').count()
      : 1

    const missingFields = []
    for (const field of item.fields) {
      const count = await page.getByText(field, { exact: false }).count()
      if (count === 0) missingFields.push(field)
    }

    await page.getByRole('button', { name: /记录今日|记录中/ }).click()
    await page.waitForSelector('text=已记录', { timeout: 5000 })
    const toastText = await page.locator('text=已记录').first().textContent()

    const screenshot = path.join(outputDir, `m8-${item.key}-detail.png`)
    await page.screenshot({ path: screenshot, fullPage: true })

    results.push({
      key: item.key,
      path: item.path,
      titleVisible: await page.getByText(item.title, { exact: false }).count() > 0,
      expectedLayout: item.layout,
      layoutExists: layoutExists > 0,
      centerSpaceExists: centerSpaceExists > 0,
      missingFields,
      submitToast: toastText,
      screenshot,
      passed: layoutExists > 0 && centerSpaceExists > 0 && missingFields.length === 0 && Boolean(toastText),
    })
  }

  await browser.close()

  const report = {
    generatedAt: new Date().toISOString(),
    viewport: '1920x1080',
    sourceDocs: [
      '项目立项文档.md 5.3-5.7',
      'docs/前端技术方案与实施计划.md Sprint 3',
      'docs/后端技术方案.md 4.3, 6',
      'docs/数据库设计.md 3.3-3.7',
    ],
    results,
    passed: results.every((result) => result.passed),
  }

  fs.writeFileSync(path.join(outputDir, 'm8-detail-pages-verification.json'), JSON.stringify(report, null, 2), 'utf8')
  console.log(JSON.stringify(report, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
