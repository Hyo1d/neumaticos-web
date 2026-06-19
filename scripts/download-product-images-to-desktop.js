const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')
const { parseCsv, slugify, stringifyCsv } = require('./product-image-csv-utils')

const CSV_PATH = process.argv[2] || 'data/product-image-candidates.csv'
const OUTPUT_DIR = process.argv[3] || 'C:/Users/Casia/Desktop/Imagenes Productos Fantini'
const LIMIT_ARG = process.argv.find((arg) => arg.startsWith('--limit='))
const LIMIT = LIMIT_ARG ? Number(LIMIT_ARG.split('=')[1]) : Infinity

const BRAND_DOMAINS = {
  Bridgestone: ['bridgestone', 'bridgestonetire'],
  Doublestar: ['doublestar'],
  Fate: ['fate'],
  Firestone: ['firestone'],
  Giti: ['giti'],
  Goodyear: ['goodyear'],
  Greentrac: ['greentrac'],
  'GT Radial': ['gtradial', 'gt-radial'],
  Hankook: ['hankook'],
  Kumho: ['kumho'],
  Lanvigator: ['lanvigator'],
  Michelin: ['michelin'],
  Pirelli: ['pirelli'],
  Wanli: ['wanli']
}

const BAD_DOMAINS = [
  'facebook.',
  'instagram.',
  'mercadolibre.',
  'pinterest.',
  'reddit.',
  'shutterstock.',
  'tiktok.',
  'twitter.',
  'x.com',
  'youtube.'
]

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function cleanText(value) {
  return String(value ?? '').toLowerCase()
}

function scoreResult(row, result) {
  const url = cleanText(result.image)
  const page = cleanText(result.url)
  const title = cleanText(result.title)
  const brand = cleanText(row.brand)
  const modelWords = cleanText(row.model)
    .replace(/[()]/g, ' ')
    .split(/[^a-z0-9]+/g)
    .filter((word) => word.length >= 3 && !['tire', 'tyre', 'photo', 'product'].includes(word))

  let score = 0
  const haystack = `${url} ${page} ${title}`

  if (haystack.includes(brand.replace(/\s+/g, ''))) score += 8
  if (haystack.includes(brand)) score += 8

  for (const word of modelWords) {
    if (haystack.includes(word)) score += 4
  }

  for (const domain of BRAND_DOMAINS[row.brand] ?? []) {
    if (haystack.includes(domain)) score += 20
  }

  if (url.includes('.png')) score += 5
  if (url.includes('.webp')) score += 3
  if (haystack.includes('product')) score += 4
  if (haystack.includes('tire') || haystack.includes('tyre')) score += 4
  if (haystack.includes('logo')) score -= 8
  if (haystack.includes('review')) score -= 5
  if (haystack.includes('vehicle') || haystack.includes('car ')) score -= 4

  for (const badDomain of BAD_DOMAINS) {
    if (haystack.includes(badDomain)) score -= 50
  }

  return score
}

async function getDuckDuckGoVqd(query) {
  const response = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`, {
    headers: { 'user-agent': 'Mozilla/5.0' }
  })
  const html = await response.text()
  return html.match(/vqd=['"]?([^'"]+)/)?.[1] ?? ''
}

async function searchImages(row) {
  const query = `${row.brand} ${row.model} tire product image`
  const vqd = await getDuckDuckGoVqd(query)
  if (!vqd) return []

  const response = await fetch(
    `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}&f=,,,,,&p=1`,
    { headers: { 'user-agent': 'Mozilla/5.0', referer: 'https://duckduckgo.com/' } }
  )

  if (!response.ok) return []
  const data = await response.json()
  return (data.results ?? [])
    .map((result) => ({ ...result, score: scoreResult(row, result) }))
    .sort((left, right) => right.score - left.score)
}

async function downloadImage(url, targetBase) {
  const response = await fetch(url, {
    headers: { 'user-agent': 'Mozilla/5.0' },
    signal: AbortSignal.timeout(20000)
  })

  if (!response.ok) throw new Error(`HTTP ${response.status}`)

  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.startsWith('image/')) throw new Error(`No es imagen: ${contentType || 'sin content-type'}`)

  const ext = contentType.includes('png')
    ? 'png'
    : contentType.includes('webp')
      ? 'webp'
      : contentType.includes('gif')
        ? 'gif'
        : 'jpg'

  const target = `${targetBase}.${ext}`
  fs.writeFileSync(target, Buffer.from(await response.arrayBuffer()))
  return target
}

function convertToWebp(inputPath, outputPath) {
  const result = spawnSync(
    'ffmpeg',
    [
      '-y',
      '-loglevel',
      'error',
      '-i',
      inputPath,
      '-vf',
      'scale=1040:1040:force_original_aspect_ratio=decrease,pad=1200:1200:(ow-iw)/2:(oh-ih)/2:white,format=yuv420p',
      '-frames:v',
      '1',
      '-c:v',
      'libwebp',
      '-quality',
      '88',
      '-compression_level',
      '6',
      outputPath
    ],
    { encoding: 'utf8' }
  )

  if (result.status !== 0) throw new Error(result.stderr || 'ffmpeg fallo')
}

async function main() {
  const rows = parseCsv(fs.readFileSync(CSV_PATH, 'utf8')).slice(0, LIMIT)
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  const rawDir = path.join(OUTPUT_DIR, '_sources')
  fs.mkdirSync(rawDir, { recursive: true })

  const report = []

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index]
    const filename = `${String(index + 1).padStart(3, '0')}-${slugify(`${row.brand}-${row.model}`)}.webp`
    const outputPath = path.join(OUTPUT_DIR, filename)

    if (fs.existsSync(outputPath)) {
      report.push({ ...row, local_path: outputPath, source_image_url: '', source_page_url: '', source_title: '', score: '', result: 'exists' })
      continue
    }

    process.stdout.write(`[${index + 1}/${rows.length}] ${row.brand} ${row.model}... `)

    try {
      const results = await searchImages(row)
      let saved = false
      let lastError = ''

      for (const result of results.slice(0, 8)) {
        try {
          const rawBase = path.join(rawDir, slugify(`${row.brand}-${row.model}-${result.score}`))
          const downloaded = await downloadImage(result.image, rawBase)
          convertToWebp(downloaded, outputPath)

          report.push({
            ...row,
            local_path: outputPath,
            source_image_url: result.image,
            source_page_url: result.url ?? '',
            source_title: result.title ?? '',
            score: result.score,
            result: 'ok'
          })
          saved = true
          console.log('ok')
          break
        } catch (error) {
          lastError = error.message
        }
      }

      if (!saved) {
        report.push({ ...row, local_path: '', source_image_url: '', source_page_url: '', source_title: '', score: '', result: lastError || 'sin resultado' })
        console.log(`fallo: ${lastError || 'sin resultado'}`)
      }
    } catch (error) {
      report.push({ ...row, local_path: '', source_image_url: '', source_page_url: '', source_title: '', score: '', result: error.message })
      console.log(`fallo: ${error.message}`)
    }

    await sleep(450)
  }

  const headers = [
    'group_key',
    'brand',
    'model',
    'product_count',
    'sample_product_name',
    'sample_sku',
    'product_ids',
    'local_path',
    'source_image_url',
    'source_page_url',
    'source_title',
    'score',
    'result'
  ]

  fs.writeFileSync(path.join(OUTPUT_DIR, 'sources.csv'), `${stringifyCsv(report, headers)}\n`)
  console.log(`\nCarpeta: ${OUTPUT_DIR}`)
  console.log(`Reporte: ${path.join(OUTPUT_DIR, 'sources.csv')}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
