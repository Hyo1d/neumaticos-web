export default function AdminDiscountsPage() {
  return (
    <>
      <p className="text-sm font-black uppercase text-rubber">Promociones</p>
      <h1 className="font-display text-6xl font-bold text-[#121629]">Descuentos</h1>
      <section className="mt-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1fr_180px_180px_auto]">
          <input className="h-11 rounded-md border border-slate-200 px-3 text-sm" placeholder="Codigo" />
          <input className="h-11 rounded-md border border-slate-200 px-3 text-sm" placeholder="% descuento" type="number" />
          <input className="h-11 rounded-md border border-slate-200 px-3 text-sm" placeholder="Stock usos" type="number" />
          <button className="rounded-md bg-rubber px-5 py-3 text-sm font-black uppercase text-white">Crear</button>
        </div>
      </section>
    </>
  )
}
