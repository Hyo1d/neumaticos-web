import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(value)
}

export function parseTireSize(input: string) {
  const match = input
    .trim()
    .match(/(\d{3})\s*[\/-]?\s*(\d{2,3})\s*[\/-]?\s*[Rr]?\s*(\d{2})/)
  if (!match) return null

  return {
    width: Number(match[1]),
    aspectRatio: Number(match[2]),
    rimSize: Number(match[3])
  }
}
