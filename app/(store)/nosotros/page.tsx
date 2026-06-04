import Image from 'next/image'
import { MapPin, Phone, Wrench } from 'lucide-react'
import WhatsAppIcon from '@/components/store/WhatsAppIcon'
import { site } from '@/lib/site'

export default function AboutPage() {
  return (
    <section className="container-x py-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-lg bg-rubber p-8 text-white shadow-[0_20px_55px_rgba(37,42,120,0.18)]">
          <p className="text-sm font-black uppercase text-white/70">Sucursal</p>
          <h1 className="mt-2 font-display text-6xl font-bold leading-none">{site.name}</h1>
          <p className="mt-5 max-w-3xl text-lg text-white/85">Atendemos en Jesus Maria con venta de neumaticos, llantas deportivas, alineado, balanceado y enderezado/centrado de llantas.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-md bg-white/12 p-4"><MapPin /><p className="mt-3 font-black">Direccion</p><p className="text-white/80">{site.address}</p></div>
            <div className="rounded-md bg-white/12 p-4">
              <Phone />
              <p className="mt-3 font-black">Contacto</p>
              <p className="text-white/80">Tel: {site.phone}</p>
              <p className="mt-2 inline-flex items-center gap-2 text-white"><WhatsAppIcon className="h-5 w-5 text-whatsapp" /> {site.whatsapp}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <Image src={site.logoUrl} alt={site.name} width={240} height={160} className="mx-auto rounded-lg object-contain shadow-sm" />
          <p className="mt-6 font-black uppercase text-rubber">Servicios</p>
          <div className="mt-3 grid gap-3">
            {site.services.map((service) => (
              <div key={service} className="flex items-center gap-3 rounded-md border border-slate-200 p-3 font-bold text-slate-700">
                <Wrench size={18} className="text-rubber" /> {service}
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm font-semibold text-slate-500">{site.email}</p>
        </div>
      </div>
    </section>
  )
}
