const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')
const { createClient } = require('@supabase/supabase-js')
const { loadEnv, parseCsv, slugify } = require('./product-image-csv-utils')

const CSV_PATH = process.argv[2] || 'data/product-image-candidates.csv'
const SHOULD_COMMIT = process.argv.includes('--commit')
const TMP_DIR = 'tmp/product-images'
const BUCKET = 'product-images'

function extensionFromContentType(contentType) {
  if (contentType.includes('png')) return 'png'
  if (contentType.includes('webp')) return 'webp'
  if (contentType.includes('jpeg') || contentType.includes('jpg')) return 'jpg'
  return 'img'
}

async function downloadImage(url, targetBase) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 FantiniProductImageImporter/1.0'
    }
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.startsWith('image/')) {
    throw new Error(`La URL no devolvio una imagen (${contentType || 'sin content-type'})`)
  }

  const ext = extensionFromContentType(contentType)
  const target = `${targetBase}.${ext}`
  const buffer = Buffer.from(await response.arrayBuffer())
  fs.writeFileSync(target, buffer)
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

  if (result.status !== 0) {
    throw new Error(result.stderr || 'No se pudo convertir la imagen a WebP.')
  }
}

async function main() {
  const env = loadEnv()
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
  const csv = fs.readFileSync(CSV_PATH, 'utf8')
  const rows = parseCsv(csv)
  const approvedRows = rows.filter((row) => row.approved_image_url.trim() && row.status.trim().toLowerCase() !== 'skip')

  fs.mkdirSync(TMP_DIR, { recursive: true })

  console.log(`CSV: ${CSV_PATH}`)
  console.log(`Filas aprobadas: ${approvedRows.length}`)
  console.log(SHOULD_COMMIT ? 'Modo: COMMIT, actualiza Supabase.' : 'Modo: DRY RUN, no actualiza Supabase.')

  for (const row of approvedRows) {
    const groupKey = slugify(row.group_key || `${row.brand}-${row.model}`)
    const productIds = row.product_ids.split('|').map((id) => id.trim()).filter(Boolean)
    const base = path.join(TMP_DIR, groupKey)
    const source = await downloadImage(row.approved_image_url.trim(), `${base}-source`)
    const webp = `${base}.webp`
    convertToWebp(source, webp)

    const storagePath = `products/${groupKey}.webp`
    const publicUrl = `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`

    console.log(`${row.brand} ${row.model}: ${productIds.length} productos -> ${storagePath}`)

    if (!SHOULD_COMMIT) continue

    const file = fs.readFileSync(webp)
    const upload = await supabase.storage.from(BUCKET).upload(storagePath, file, {
      contentType: 'image/webp',
      upsert: true
    })
    if (upload.error) throw upload.error

    const update = await supabase
      .from('products')
      .update({ images: [publicUrl] })
      .in('id', productIds)

    if (update.error) throw update.error
  }

  console.log(SHOULD_COMMIT ? 'Listo: imagenes aplicadas.' : 'Listo: dry-run terminado. Revisa tmp/product-images antes de --commit.')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
