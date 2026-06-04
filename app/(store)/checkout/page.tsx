import CheckoutForm from '@/components/store/CheckoutForm'

export default function CheckoutPage() {
  return (
    <section className="container-x py-10">
      <p className="text-sm font-bold uppercase text-rubber">Checkout</p>
      <h1 className="font-display text-6xl font-bold">Finalizar compra</h1>
      <div className="mt-8"><CheckoutForm /></div>
    </section>
  )
}
