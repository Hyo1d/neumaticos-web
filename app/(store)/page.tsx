import Image from 'next/image'
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

      <section className="border-y border-slate-200 bg-white py-10 sm:py-14">
        <div className="container-x">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-sm font-black uppercase text-rubber">Fantini por dentro</p>
              <h2 className="font-display text-4xl font-bold text-[#121629] sm:text-5xl">Stock real y taller propio</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-500 sm:text-base">
                Trabajamos con disponibilidad real, equipamiento de taller y asesoramiento en nuestra sucursal de Jesus Maria.
              </p>
            </div>
            <Link href="/nosotros" className="rounded-md border border-rubber/20 px-5 py-3 text-sm font-black uppercase text-rubber">
              Conocer la sucursal
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-[1.25fr_1fr_1fr]">
            <div className="relative col-span-2 min-h-72 overflow-hidden rounded-md lg:col-span-1 lg:min-h-[460px]">
              <Image
                src="/fantini/photos/stock-pilas.webp"
                alt="Stock de neumaticos disponible en Fantini"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
            </div>
            <div className="relative min-h-64 overflow-hidden rounded-md lg:min-h-[460px]">
              <Image
                src="/fantini/photos/rack-michelin.webp"
                alt="Neumaticos exhibidos en la sucursal"
                fill
                sizes="(max-width: 1024px) 50vw, 29vw"
                className="object-cover"
              />
            </div>
            <div className="relative min-h-64 overflow-hidden rounded-md lg:min-h-[460px]">
              <Image
                src="/fantini/photos/deposito-stock.webp"
                alt="Deposito de cubiertas de Fantini"
                fill
                sizes="(max-width: 1024px) 50vw, 29vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

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
