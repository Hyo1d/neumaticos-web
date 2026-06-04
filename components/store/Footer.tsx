import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone } from 'lucide-react'
import WhatsAppIcon from '@/components/store/WhatsAppIcon'
import { site } from '@/lib/site'

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white">
      <div className="container-x grid gap-8 py-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Image src={site.logoUrl} alt={site.name} width={150} height={64} className="h-16 w-auto rounded-md object-contain shadow-sm" />
          <p className="mt-4 max-w-sm text-sm font-semibold text-slate-500">Venta de neumaticos, llantas deportivas, alineado, balanceado y reparacion de llantas en Jesus Maria.</p>
        </div>
        <div className="text-sm">
          <p className="font-black uppercase text-[#121629]">Tienda</p>
          <Link className="mt-3 block font-semibold text-slate-500 hover:text-rubber" href="/catalogo">Catalogo</Link>
          <Link className="mt-2 block font-semibold text-slate-500 hover:text-rubber" href="/buscar">Buscador por medida</Link>
          <Link className="mt-2 block font-semibold text-slate-500 hover:text-rubber" href="/carrito">Carrito</Link>
        </div>
        <div className="text-sm">
          <p className="font-black uppercase text-[#121629]">Contacto</p>
          <p className="mt-3 flex items-start gap-2 font-semibold text-slate-500"><MapPin size={16} className="mt-0.5 text-rubber" /> {site.address}</p>
          <p className="mt-2 flex items-center gap-2 font-semibold text-slate-500"><Phone size={16} className="text-rubber" /> Tel: {site.phone}</p>
          <p className="mt-2 flex items-center gap-2 font-semibold text-slate-500"><WhatsAppIcon className="h-5 w-5 text-whatsapp" /> WhatsApp: {site.whatsapp}</p>
          <p className="mt-2 font-semibold text-slate-500">{site.email}</p>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4">
        <div className="container-x flex flex-col items-center justify-between gap-3 text-xs font-bold text-slate-400 sm:flex-row">
          <span>{site.name} - Todos los derechos reservados</span>
          <Link
            href="https://maderklabs.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 opacity-60 transition hover:opacity-100"
            aria-label="Powered by Maderk Labs"
          >
            <span>Powered by</span>
            <Image
              src="/brand/maderk-labs-logotipo-black.svg"
              alt="Maderk Labs"
              width={92}
              height={20}
              className="h-4 w-auto"
            />
          </Link>
        </div>
      </div>
    </footer>
  )
}
