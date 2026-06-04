import Image from 'next/image'
import FeaturedProductsSelector from '@/components/admin/FeaturedProductsSelector'
import SupabaseNotice from '@/components/admin/SupabaseNotice'
import { fallbackHeroSlides, fallbackPromoMessages, getHeroSlides, getPromoMessages } from '@/lib/site-content'
import { getProducts } from '@/lib/catalog'
import { formatPrice } from '@/lib/utils'
import { saveHeroSlidesAction, savePromoMessagesAction, updateFeaturedProductsAction } from '@/app/(admin)/admin/configuracion/actions'

export default async function AdminConfigPage() {
  const [heroSlides, promoMessages, products] = await Promise.all([getHeroSlides(), getPromoMessages(), getProducts()])
  const slides = [...heroSlides, ...fallbackHeroSlides].slice(0, 4)
  const messages = [...promoMessages, ...fallbackPromoMessages].slice(0, 8)

  return (
    <>
      <p className="text-sm font-black uppercase text-rubber">Tienda</p>
      <h1 className="font-display text-6xl font-bold text-[#121629]">Configuracion</h1>
      <div className="mt-8"><SupabaseNotice /></div>

      <div className="mt-6 grid gap-6">
        <form action={savePromoMessagesAction} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-4xl font-bold text-[#121629]">Header de promociones</h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">Mensajes que aparecen en la banda superior del sitio.</p>
            </div>
            <button className="rounded-md bg-rubber px-5 py-3 text-sm font-black uppercase text-white">Guardar promociones</button>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {messages.map((message, index) => (
              <label key={index} className="grid gap-1 text-xs font-black uppercase text-slate-500">
                Mensaje {index + 1}
                <input name={`message_${index}`} defaultValue={message} className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold normal-case text-slate-900" placeholder="Ej: 6 cuotas sin interes" />
              </label>
            ))}
          </div>
        </form>

        <form action={saveHeroSlidesAction} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-4xl font-bold text-[#121629]">Hero principal</h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">Slides grandes de la home. Podes usar URL o subir una imagen nueva.</p>
            </div>
            <button className="rounded-md bg-rubber px-5 py-3 text-sm font-black uppercase text-white">Guardar hero</button>
          </div>

          <div className="mt-5 grid gap-5">
            {slides.map((slide, index) => (
              <fieldset key={index} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <legend className="px-2 text-sm font-black uppercase text-rubber">Slide {index + 1}</legend>
                <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-slate-200">
                    <Image src={slide.image} alt={slide.imageAlt || slide.title} fill sizes="220px" className="object-cover" />
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
                      Volanta
                      <input name={`slide_${index}_eyebrow`} defaultValue={slide.eyebrow} className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold normal-case text-slate-900" />
                    </label>
                    <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
                      Titulo
                      <input name={`slide_${index}_title`} defaultValue={slide.title} className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold normal-case text-slate-900" />
                    </label>
                    <label className="grid gap-1 text-xs font-black uppercase text-slate-500 md:col-span-2">
                      Texto
                      <textarea name={`slide_${index}_text`} defaultValue={slide.text} className="min-h-20 rounded-md border border-slate-200 bg-white px-3 py-3 text-sm font-semibold normal-case text-slate-900" />
                    </label>
                    <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
                      Texto boton
                      <input name={`slide_${index}_cta`} defaultValue={slide.cta} className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold normal-case text-slate-900" />
                    </label>
                    <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
                      Enlace boton
                      <input name={`slide_${index}_href`} defaultValue={slide.href} className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold normal-case text-slate-900" />
                    </label>
                    <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
                      URL imagen actual
                      <input name={`slide_${index}_image`} defaultValue={slide.image} className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold normal-case text-slate-900" />
                    </label>
                    <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
                      Texto alternativo
                      <input name={`slide_${index}_image_alt`} defaultValue={slide.imageAlt} className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold normal-case text-slate-900" />
                    </label>
                    <label className="grid gap-1 text-xs font-black uppercase text-slate-500 md:col-span-2">
                      Subir nueva imagen
                      <input name={`slide_${index}_image_file`} type="file" accept="image/*" className="rounded-md border border-slate-200 bg-white px-3 py-3 text-sm normal-case" />
                      <span className="text-xs font-semibold normal-case leading-5 text-slate-500">
                        Medida recomendada: 1920 x 720 px, formato JPG o PNG. Mantene el contenido importante centrado para que no se corte en mobile.
                      </span>
                    </label>
                  </div>
                </div>
              </fieldset>
            ))}
          </div>
        </form>

        <form action={updateFeaturedProductsAction} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-4xl font-bold text-[#121629]">Neumaticos destacados</h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">Selecciona los productos que aparecen en la seccion destacada de la home.</p>
            </div>
            <button className="rounded-md bg-rubber px-5 py-3 text-sm font-black uppercase text-white">Guardar destacados</button>
          </div>

          <FeaturedProductsSelector products={products} />
        </form>
      </div>
    </>
  )
}
