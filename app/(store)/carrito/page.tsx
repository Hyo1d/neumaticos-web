import CheckoutForm from '@/components/store/CheckoutForm'

export default function CartPage() {
  return (
    <section className="container-x py-10">
      <h1 className="font-display text-6xl font-bold">Carrito y checkout</h1>
      <div className="mt-8"><CheckoutForm /></div>
    </section>
  )
}
