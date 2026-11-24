import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default async function Page() {
  const { data: listings } = await supabase.from('listings').select('*')
  return (
    <main style={{ fontFamily: 'sans-serif', padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <p><Link href="/">← Back to CarFriendly</Link></p>
      <h1 style={{ fontSize: 38, lineHeight: 1.1 }}>Cheap Finance Car — Find a Car, Then Get The Lowest Finance Deal</h1>
      <p style={{ fontSize: 18, color: '#333' }}>Looking for a car on finance? Start with a car you actually want, then we show you the lowest 3 finance deals ranked by total repayable — no sponsored placement. Updated every day at 06:00.</p>
      <div style={{ background: '#fff7e6', padding: 16, borderRadius: 12 }}>
        <h3>How finance works on CarFriendly</h3>
        <p>1. Pick a car below. 2. Make a qualifying offer to unlock slots. 3. Book a viewing. 4. If you buy, choose finance at the escrow step — partner bank holds the money, you pay the finance partner monthly. We never arrange finance ourselves, we just show you the cheapest 3.</p>
        <p style={{ fontSize: 13, color: '#555' }}>Example: Ford Focus £8,950 — if you put £1,000 deposit and finance £7,950 over 36 months, the total repayable is what matters, not just the monthly payment. Always check the total.</p>
      </div>
      <h2 style={{ marginTop: 28 }}>Cars You Can Finance: {listings?.length}</h2>
      {listings?.map((car: any) => (
        <Link key={car.id} href={`/car/${car.id}`} style={{ textDecoration: 'none', color: 'black' }}>
          <div style={{ display: 'flex', gap: 16, border: '1px solid #ddd', padding: 16, marginBottom: 12, borderRadius: 12 }}>
            <div style={{ width: 120, height: 80, background: '#eee', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>🚗</div>
            <div><h3 style={{ margin: 0 }}>{car.title}</h3><p style={{ margin: '4px 0' }}>{car.year} • {car.mileage} miles • {car.postcode}</p><p style={{ margin: 0, fontWeight: 'bold', fontSize: 20 }}>£{car.price} — See finance options →</p></div>
          </div>
        </Link>
      ))}
    </main>
  )
}