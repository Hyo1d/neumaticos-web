import Link from 'next/link'
import { Car, Gauge, ShieldCheck, Truck, Wrench } from 'lucide-react'
import BrandLogoCarousel from '@/components/store/BrandLogoCarousel'
import HeroBanner from '@/components/store/HeroBanner'
import TireSearch from '@/components/store/TireSearch'
import ProductGrid from '@/components/store/ProductGrid'
import { getCategories, getFeaturedProducts } from '@/lib/catalog'
import { getHeroSlides } from '@/lib/site-content'

const categoryIconMap = {
  Auto: Car,
  SUV: Truck,
  Camionetas: ShieldCheck,
  Deportivo: Gauge
}

const categoryTextMap = {
  Auto: 'Medidas urbanas y ruta',
  SUV: 'Cubiertas confort y seguridad',
  Camionetas: 'Uso diario, carga y ruta',
  Deportivo: 'Mayor agarre y respuesta'
}

export default async function HomePage() {
  const [categories, featuredProducts, heroSlides] = await Promise.all([getCategories(), getFeaturedProducts(), getHeroSlides()])

  return (
    <>
      <section className="bg-white">
        <HeroBanner slides={heroSlides} />

        <div className="container-x relative z-10 py-6">
          <TireSearch />
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-5">
        <div className="container-x">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase text-rubber">Compra rapido</p>
              <h2 className="font-display text-3xl font-bold text-[#121629] sm:text-4xl">Elegi que necesitas</h2>
            </div>
            <Link href="/catalogo" className="text-sm font-black uppercase text-rubber">Ver todo</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => {
              const Icon = categoryIconMap[category.name as keyof typeof categoryIconMap] ?? Gauge
              const text = categoryTextMap[category.name as keyof typeof categoryTextMap] ?? 'Ver medidas disponibles'

              return (
                <Link key={category.id} href={`/categorias/${category.slug}`} className="group flex min-h-24 items-center gap-4 rounded-md border border-slate-200 bg-slate-50 px-5 py-4 transition hover:border-rubber hover:bg-white hover:shadow-lg">
                  <span className="grid h-12 w-12 flex-none place-items-center rounded-md bg-rubber text-white transition group-hover:bg-whatsappDark">
                    <Icon size={23} />
                  </span>
                  <span>
                    <span className="block font-display text-2xl font-bold leading-none text-[#121629] sm:text-3xl">{category.name}</span>
                    <span className="mt-1 block text-sm font-bold text-slate-500">{text}</span>
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <BrandLogoCarousel />

      <section className="container-x py-10">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase text-rubber">Oportunidades</p>
            <h2 className="font-display text-4xl font-bold text-[#121629] sm:text-5xl">Neumaticos destacados</h2>
          </div>
          <Link href="/catalogo" className="rounded-md bg-rubber px-5 py-3 text-sm font-black uppercase text-white">Ver catalogo</Link>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>

      <section className="container-x pb-10">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><Gauge className="text-rubber" /><p className="mt-3 font-black">Busca por medida</p><p className="text-sm text-slate-500">Ancho, alto y rodado como en una tienda real.</p></div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><Wrench className="text-rubber" /><p className="mt-3 font-black">Taller completo</p><p className="text-sm text-slate-500">Alineado, balanceado y reparacion de llantas.</p></div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><ShieldCheck className="text-rubber" /><p className="mt-3 font-black">Todas las marcas</p><p className="text-sm text-slate-500">Greentrac, Michelin, Firestone, Giti, Bridgestone, Goodyear y Wanli.</p></div>
        </div>
      </section>

    </>
  )
}
