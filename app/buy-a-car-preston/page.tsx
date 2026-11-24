import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default async function Page() {
  const { data: listings } = await supabase.from('listings').select('*')
  return (
    <main style={{ fontFamily: 'sans-serif', padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <p><Link href="/">← Back to CarFriendly</Link></p>
      <h1 style={{ fontSize: 38, lineHeight: 1.1 }}>Buy a Car in Preston — No Tyrekickers. Only Real Sellers.</h1>
      <p style={{ fontSize: 18, color: '#333' }}>Buying in Preston & North West? On CarFriendly every seller has set an Offer Gate and pre-listed Call & Viewing slots. You make a real offer, you book a real slot. No ghosting, no “is this still available?”</p>
      <div style={{ background: '#f0f7ff', padding: 16, borderRadius: 12 }}>
        <h3>How buying works</h3>
        <ol style={{ fontSize: 16, lineHeight: 1.7 }}>
          <li><b>Find a car below</b> — live cars in Preston & nearby.</li>
          <li><b>Make a pre-qualifying offer</b> — e.g. Ford Focus is £8,950, you need £8,200+ to unlock it.</li>
          <li><b>Book a slot</b> — Call FREE, Viewing £30. Fee is credited off the price if you buy, refunded if you turn up and don’t buy.</li>
          <li><b>Buy via Partner Bank Escrow</b> — you pay the bank, not the seller. Bank holds it for 24hr cooling-off after delivery, then auto-releases.</li>
        </ol>
      </div>
      <h2 style={{ marginTop: 28 }}>Live Cars in Preston & North West: {listings?.length}</h2>
      {listings?.map((car: any) => (
        <Link key={car.id} href={`/car/${car.id}`} style={{ textDecoration: 'none', color: 'black' }}>
          <div style={{ display: 'flex', gap: 16, border: '1px solid #ddd', padding: 16, marginBottom: 12, borderRadius: 12 }}>
            <div style={{ width: 120, height: 80, background: '#eee', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>🚗</div>
            <div><h3 style={{ margin: 0 }}>{car.title}</h3><p style={{ margin: '4px 0' }}>{car.year} • {car.mileage} miles • {car.postcode}</p><p style={{ margin: 0, fontWeight: 'bold', fontSize: 20 }}>£{car.price} — Offer £{car.offer_min}+ to unlock →</p></div>
          </div>
        </Link>
      ))}
      <p><Link href="/cars-for-sale-near-me">Cars for sale near me →</Link></p>
    </main>
  )
}