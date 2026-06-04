import type { HeroSlide } from '@/lib/types'
import { createAdminClient } from '@/lib/supabase/admin'

export const fallbackHeroSlides: HeroSlide[] = [
  {
    eyebrow: 'Neumaticos para auto, SUV y camioneta',
    title: 'Cubiertas de todas las marcas',
    text: 'Compra por medida y consulta disponibilidad por WhatsApp.',
    cta: 'Ver catalogo',
    href: '/catalogo',
    image: '/fantini-hero-showroom.png',
    imageAlt: 'Showroom de neumaticos y llantas'
  },
  {
    eyebrow: 'Atencion en Jesus Maria',
    title: 'Instalacion y taller completo',
    text: 'Alineado, balanceado, enderezado y centrado de llantas.',
    cta: 'Pedir turno',
    href: 'https://wa.me/5493525503984',
    image: '/fantini-hero-service.png',
    imageAlt: 'Servicio de alineacion y neumaticos'
  },
  {
    eyebrow: 'Llantas deportivas',
    title: 'Renova tu auto con asesoramiento',
    text: 'Trabajamos medidas urbanas, ruta, SUV y performance.',
    cta: 'Consultar ahora',
    href: 'https://wa.me/5493525503984',
    image: '/fantini-hero-tires.png',
    imageAlt: 'Neumaticos de auto'
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
