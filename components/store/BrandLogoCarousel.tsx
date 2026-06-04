import Image from 'next/image'
import { getBrands } from '@/lib/catalog'

function BrandLogo({ name, src }: { name: string; src: string }) {
  return (
    <div className="brand-logo-card" title={name}>
      <Image src={src} alt={`${name} logo`} width={420} height={140} className="brand-logo-img" />
    </div>
  )
}

export default async function BrandLogoCarousel() {
  const brandLogos = (await getBrands()).filter((brand) => brand.logoUrl).map((brand) => ({ name: brand.name, src: brand.logoUrl as string }))
  const loop = [...brandLogos, ...brandLogos, ...brandLogos]

  if (!brandLogos.length) return null

  return (
    <section className="border-y border-slate-200 bg-white py-4">
      <div className="container-x">
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Trabajamos todas las marcas</p>
        </div>
      </div>
      <div className="marquee-mask">
        <div className="brand-marquee">
          {loop.map((brand, index) => <BrandLogo key={`${brand.name}-${index}`} {...brand} />)}
        </div>
      </div>
    </section>
  )
}
