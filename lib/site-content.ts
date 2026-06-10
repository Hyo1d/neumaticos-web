import type { HeroSlide } from '@/lib/types'
import { createAdminClient } from '@/lib/supabase/admin'

export const fallbackHeroSlides: HeroSlide[] = [
  {
    eyebrow: 'Stock real en Jesus Maria',
    title: 'Cubiertas para cada camino',
    text: 'Elegi por medida y recibi asesoramiento para tu auto, SUV o camioneta.',
    cta: 'Ver catalogo',
    href: '/catalogo',
    image: '/fantini/photos/stock-hero.webp',
    imageAlt: 'Deposito de neumaticos de Fantini'
  },
  {
    eyebrow: 'Taller propio',
    title: 'Instalacion y servicio completo',
    text: 'Alineado, balanceado, reparacion y trabajo profesional sobre tu vehiculo.',
    cta: 'Pedir turno',
    href: 'https://wa.me/5493525503984',
    image: '/fantini/photos/taller-hero.webp',
    imageAlt: 'Taller de Fantini Neumaticos en funcionamiento'
  },
  {
    eyebrow: 'Primeras marcas',
    title: 'Asesoramiento que se ve',
    text: 'Comparamos opciones y medidas para que elijas el neumatico correcto.',
    cta: 'Consultar ahora',
    href: 'https://wa.me/5493525503984',
    image: '/fantini/photos/showroom-hero.webp',
    imageAlt: 'Exhibicion de neumaticos en Fantini'
  }
]

export const fallbackPromoMessages = [
  'Los mejores precios en neumaticos',
  '6 cuotas sin interes',
  'Precio especial por transferencia',
  'Alineado y balanceado',
  'Llantas deportivas',
  'Retiro en sucursal'
]

async function getConfigValue<T>(key: string, fallback: T): Promise<T> {
  const supabase = createAdminClient()
  if (!supabase) return fallback

  const { data, error } = await supabase.from('site_config').select('value').eq('key', key).maybeSingle()
  if (error || !data?.value) return fallback

  return data.value as T
}

export async function getHeroSlides() {
  return getConfigValue<HeroSlide[]>('hero_slides', fallbackHeroSlides)
}

export async function getPromoMessages() {
  return getConfigValue<string[]>('promo_messages', fallbackPromoMessages)
}
