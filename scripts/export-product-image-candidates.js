const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')
const { loadEnv, normalizeModelName, slugify, stringifyCsv } = require('./product-image-csv-utils')

const OUTPUT = process.argv[2] || 'data/product-image-candidates.csv'

function searchUrl(engine, query) {
  const encoded = encodeURIComponent(query)
  if (engine === 'google') return `https://www.google.com/search?tbm=isch&q=${encoded}`
  if (engine === 'bing') return `https://www.bing.com/images/search?q=${encoded}`
  return `https://duckduckgo.com/?iax=images&ia=images&q=${encoded}`
}

async function main() {
  const env = loadEnv()
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
  const { data, error } = await supabase
    .from('products')
    .select('id,name,sku,slug,width,aspect_ratio,rim_size,images,brand:brands(name),category:categories(name)')
    .order('name', { ascending: true })

  if (error) throw error

  const groups = new Map()

  for (const product of data) {
    const brand = product.brand?.name ?? ''
    const model = normalizeModelName(product.name, brand) || product.name
    const key = slugify(`${brand}-${model}`) || product.id
    const searchQuery = `${brand} ${model} tire product photo`

    if (!groups.has(key)) {
      groups.set(key, {
        group_key: key,
        brand,
        model,
        product_count: 0,
        sample_product_name: product.name,
        sample_sku: product.sku ?? '',
        product_ids: [],
        search_query: searchQuery,
        google_images_url: searchUrl('google', searchQuery),
        bing_images_url: searchUrl('bing', searchQuery),
        duckduckgo_images_url: searchUrl('duckduckgo', searchQuery),
        approved_image_url: '',
        status: '',
        notes: ''
      })
    }

    const group = groups.get(key)
    group.product_count += 1
    group.product_ids.push(product.id)
  }

  const rows = Array.from(groups.values())
    .sort((left, right) => left.brand.localeCompare(right.brand) || left.model.localeCompare(right.model))
    .map((group) => ({ ...group, product_ids: group.product_ids.join('|') }))

  const headers = [
    'group_key',
    'brand',
    'model',
    'product_count',
    'sample_product_name',
    'sample_sku',
    'product_ids',
    'search_query',
    'google_images_url',
    'bing_images_url',
    'duckduckgo_images_url',
    'approved_image_url',
    'status',
    'notes'
  ]

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true })
  fs.writeFileSync(OUTPUT, `${stringifyCsv(rows, headers)}\n`)

  const defaultImages = data.filter((product) =>
    (product.images ?? []).some((image) => String(image).includes('fantini-hero'))
  ).length

  console.log(`Productos: ${data.length}`)
  console.log(`Grupos exportados: ${rows.length}`)
  console.log(`Productos con imagen default: ${defaultImages}`)
  console.log(`CSV: ${OUTPUT}`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
