const fs = require('fs')

function loadEnv() {
  return Object.fromEntries(
    fs
      .readFileSync('.env.local', 'utf8')
      .split(/\r?\n/)
      .filter((line) => line && line.includes('=') && !line.trim().startsWith('#'))
      .map((line) => [line.slice(0, line.indexOf('=')), line.slice(line.indexOf('=') + 1)])
  )
}

function escapeCsv(value) {
  const text = value == null ? '' : String(value)
  return `"${text.replace(/"/g, '""')}"`
}

function stringifyCsv(rows, headers) {
  return [
    headers.map(escapeCsv).join(','),
    ...rows.map((row) => headers.map((header) => escapeCsv(row[header])).join(','))
  ].join('\n')
}

function parseCsv(text) {
  const rows = []
  let row = []
  let value = ''
  let quoted = false

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]
    const next = text[index + 1]

    if (quoted) {
      if (char === '"' && next === '"') {
        value += '"'
        index += 1
      } else if (char === '"') {
        quoted = false
      } else {
        value += char
      }
      continue
    }

    if (char === '"') {
      quoted = true
    } else if (char === ',') {
      row.push(value)
      value = ''
    } else if (char === '\n') {
      row.push(value)
      rows.push(row)
      row = []
      value = ''
    } else if (char !== '\r') {
      value += char
    }
  }

  if (value || row.length) {
    row.push(value)
    rows.push(row)
  }

  const headers = rows.shift() ?? []
  return rows
    .filter((items) => items.some(Boolean))
    .map((items) => Object.fromEntries(headers.map((header, index) => [header, items[index] ?? ''])))
}

function slugify(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90)
}

function normalizeModelName(name, brand) {
  const brandPattern = brand ? new RegExp(`\\b${brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'ig') : null

  return String(name)
    .replace(brandPattern ?? /$a/, '')
    .replace(/\b\d{3}\/\d{2,3}\s?r?\d{2}\b/gi, ' ')
    .replace(/\b\d{3}\/\d{2,3}\b/gi, ' ')
    .replace(/\b\d{2,3}r\d{2}\b/gi, ' ')
    .replace(/\b\d{2,3}\s?\/?\s?(xl|lt|c|pr)\b/gi, ' ')
    .replace(/\b\d{2,3}\s?[a-z]\b/gi, ' ')
    .replace(/\b\d{2,3}\/?(xl)?\/?[a-z]\b/gi, ' ')
    .replace(/\bdemo\b/gi, ' ')
    .replace(/\bcub\.?\b/gi, ' ')
    .replace(/\bcubierta\b/gi, ' ')
    .replace(/\bneumatico\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^[.\s-]+|[.\s-]+$/g, '')
}

module.exports = {
  escapeCsv,
  loadEnv,
  normalizeModelName,
  parseCsv,
  slugify,
  stringifyCsv
}
