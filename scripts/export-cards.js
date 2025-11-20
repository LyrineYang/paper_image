const path = require('path')
const fs = require('fs/promises')
const puppeteer = require('puppeteer')

const rawData = require('../data/card_data_merged.json')

const buildCardId = (entry) => {
  const base = entry.video_name ? entry.video_name.replace(/\.[^/.]+$/, '') : `card-${entry.id}`
  const suffix = entry.prompt_type ? `-${entry.prompt_type}` : ''
  return `${base}${suffix}`
}

const samples = rawData.map((entry, index) => ({
  cardId: buildCardId(entry),
  videoName: entry.video_name || `card-${index + 1}`
}))

const OUTPUT_DIR = path.join(process.cwd(), 'exports', 'puppeteer')

async function ensureOutputDir() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true })
}

function sanitizeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_')
}

async function exportCards() {
  const baseUrl = process.env.CARD_EXPORT_URL || 'http://localhost:3000/cards?bare=1'
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewport({ width: 1600, height: 1200, deviceScaleFactor: 2 })

  await page.goto(baseUrl, { waitUntil: 'networkidle0' })

  for (let i = 0; i < samples.length; i += 1) {
    const sample = samples[i]
    const selector = `[data-card-id="${sample.cardId}"]`

    await page.waitForSelector(selector, { timeout: 20000 })
    const element = await page.$(selector)

    if (!element) {
      console.warn(`未找到卡片元素: ${sample.cardId}`)
      continue
    }

    await element.evaluate((el) => el.scrollIntoView({ behavior: 'instant', block: 'center' }))
    await new Promise((resolve) => setTimeout(resolve, 300))

    const sanitizedName = sanitizeFileName(sample.videoName.replace(/\.[^/.]+$/, ''))
    const targetPath = path.join(OUTPUT_DIR, `${String(i + 1).padStart(3, '0')}_${sanitizedName}.png`)

    await element.screenshot({ path: targetPath, type: 'png' })
    console.log(`已导出: ${targetPath}`)
  }

  await browser.close()
}

async function main() {
  await ensureOutputDir()
  await exportCards()
}

main().catch((error) => {
  console.error('批量导出失败', error)
  process.exit(1)
})
