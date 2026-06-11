const fs = require('fs')
const path = require('path')

const playwright = require('C:/Users/32525/AppData/Local/npm-cache/_npx/423231821c231c73/node_modules/playwright')

const outputDir = path.join(process.cwd(), 'output', 'playwright')

function hasSegment(value, segment) {
  return typeof value === 'string' && value.includes(segment)
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
    cycleDurationTargetMs: 10000,
    sleepGood: null,
    dietCalm: null,
    sleepFeedback: null,
    syntheticBad: null,
  }

  await page.goto('http://127.0.0.1:4173/sleep', { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)

  report.sleepGood = await page.evaluate(() => {
    const video = document.querySelector('video')
    return {
      src: video?.getAttribute('src') ?? '',
      currentSrc: video?.currentSrc ?? '',
      loop: video?.loop ?? null,
    }
  })

  await page.screenshot({
    path: path.join(outputDir, 'm11-sleep-good.png'),
    fullPage: true,
  })

  await page.goto('http://127.0.0.1:4173/diet', { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)

  report.dietCalm = await page.evaluate(() => {
    const video = document.querySelector('video')
    return {
      src: video?.getAttribute('src') ?? '',
      currentSrc: video?.currentSrc ?? '',
      loop: video?.loop ?? null,
      className: video?.className ?? '',
    }
  })

  await page.screenshot({
    path: path.join(outputDir, 'm11-diet-calm.png'),
    fullPage: true,
  })

  await page.goto('http://127.0.0.1:4173/sleep', { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)
  await page.locator('form button[type="submit"]').first().click()
  await page.waitForTimeout(150)

  report.sleepFeedback = await page.evaluate(() => {
    const video = document.querySelector('video')
    return {
      src: video?.getAttribute('src') ?? '',
      currentSrc: video?.currentSrc ?? '',
      loop: video?.loop ?? null,
    }
  })

  await page.screenshot({
    path: path.join(outputDir, 'm11-sleep-feedback.png'),
    fullPage: true,
  })

  const syntheticBad = await context.newPage()
  await syntheticBad.goto('http://127.0.0.1:4173/__m11_bad_test__', { waitUntil: 'domcontentloaded' })
  await syntheticBad.setContent(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>m11 bad state audit</title>
      </head>
      <body>
        <div id="root"></div>
        <script type="module">
          import React from '/node_modules/.vite/deps/react.js'
          import ReactDOM from '/node_modules/.vite/deps/react-dom_client.js'
          import BackgroundLayer from '/src/components/background/BackgroundLayer.tsx'
          import { assetUrl } from '/src/config/assetUrls.ts'

          const root = ReactDOM.createRoot(document.getElementById('root'))
          root.render(
            React.createElement(BackgroundLayer, {
              image: '鍥句竴.png',
              scene: {
                state: 'bad',
                source: assetUrl('S-03.mp4'),
                poster: assetUrl('鍥句竴.png'),
                loop: false,
                freezeOnEnd: true,
              },
            }),
          )
        </script>
      </body>
    </html>
  `)
  await syntheticBad.waitForTimeout(600)

  report.syntheticBad = await syntheticBad.evaluate(() => {
    const video = document.querySelector('video')
    return {
      src: video?.getAttribute('src') ?? '',
      currentSrc: video?.currentSrc ?? '',
      loop: video?.loop ?? null,
    }
  })

  await syntheticBad.screenshot({
    path: path.join(outputDir, 'm11-synthetic-bad.png'),
    fullPage: true,
  })

  report.assertions = {
    sleepGoodUsesS01: hasSegment(report.sleepGood?.src, 'S-01.mp4') || hasSegment(report.sleepGood?.currentSrc, 'S-01.mp4'),
    dietCalmUsesD01: hasSegment(report.dietCalm?.src, 'D-01.mp4') || hasSegment(report.dietCalm?.currentSrc, 'D-01.mp4'),
    dietCalmFilterApplied: hasSegment(report.dietCalm?.className, 'ip-video--calm'),
    sleepFeedbackUsesS04:
      hasSegment(report.sleepFeedback?.src, 'S-04.mp4') || hasSegment(report.sleepFeedback?.currentSrc, 'S-04.mp4'),
    syntheticBadUsesS03:
      hasSegment(report.syntheticBad?.src, 'S-03.mp4') || hasSegment(report.syntheticBad?.currentSrc, 'S-03.mp4'),
    loopDisabledForTimedCycle: report.sleepGood?.loop === false && report.dietCalm?.loop === false,
    loopDisabledForBadAndFeedback: report.syntheticBad?.loop === false && report.sleepFeedback?.loop === false,
  }

  fs.writeFileSync(
    path.join(outputDir, 'm11-video-state-verification.json'),
    JSON.stringify(report, null, 2),
    'utf8',
  )

  await syntheticBad.close()
  await browser.close()
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
