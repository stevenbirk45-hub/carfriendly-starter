import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default async function Page() {
  const { data: listings } = await supabase.from('listings').select('*')
  return (
    <main style={{ fontFamily: 'sans-serif', padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <p><Link href="/">← Back to CarFriendly</Link></p>
      <h1 style={{ fontSize: 38, lineHeight: 1.1 }}>Cars For Sale Near Me — Real Cars, Real Sellers, Real Slots</h1>
      <p style={{ fontSize: 18, color: '#333' }}>Tired of adverts where the seller never replies? Every car below has a seller who has already picked when they’ll take Calls and Viewings. You don’t message and hope — you offer and book.</p>
      <div style={{ background: '#e6ffed', padding: 16, borderRadius: 12 }}>
        <h3>Why “near me” is better here</h3>
        <p>Filter by postcode / distance in the full site. For now, these are live cars near Preston. Each one shows its postcode, so you know how far it is before you offer.</p>
      </div>
      <h2 style={{ marginTop: 28 }}>Live Cars Near You: {listings?.length}</h2>
      {listings?.map((car: any) => (
        <Link key={car.id} href={`/car/${car.id}`} style={{ textDecoration: 'none', color: 'black' }}>
          <div style={{ display: 'flex', gap: 16, border: '1px solid #ddd', padding: 16, marginBottom: 12, borderRadius: 12 }}>
            <div style={{ width: 120, height: 80, background: '#eee', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>🚗</div>
            <div><h3 style={{ margin: 0 }}>{car.title}</h3><p style={{ margin: '4px 0' }}>{car.year} • {car.mileage} miles • {car.postcode}</p><p style={{ margin: 0, fontWeight: 'bold', fontSize: 20 }}>£{car.price} — Offer £{car.offer_min}+ →</p></div>
          </div>
        </Link>
      ))}
      <p><Link href="/buy-a-car-preston">Buy a car in Preston →</Link></p>
    </main>
  )
}