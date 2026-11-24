import SaveSearchButton from './components/SaveSearchButton'
import SaveButton from './components/SaveButton'
import { supabase } from '../lib/supabase'
import Link from 'next/link'
import AuthGate from './components/AuthGate'

export default async function Home({ searchParams }: any) {
  const sp = await searchParams
  const q = sp?.q || ''
  const maxPrice = Number(sp?.maxPrice || 999999)
  const maxMileage = Number(sp?.maxMileage || 999999)
  const minYear = Number(sp?.minYear || 0)
  let query = supabase.from('listings').select('*').lte('price', maxPrice).lte('mileage', maxMileage).gte('year', minYear)
  if (q) query = query.ilike('title', `%${q}%`)
  const { data: listings } = await query
  return (
    <main style={{ fontFamily: 'sans-serif', padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 32, marginBottom: 4 }}>CarFriendly</h1>
      <p style={{ color: '#555', marginTop: 0 }}>Car Buying, The Friendly Way. No Tyrekickers. Only Real Buyers.</p>
      <p style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <a href="/sell-my-car-free" style={{ background: '#0070f3', color: 'white', padding: '10px 16px', borderRadius: 8, textDecoration: 'none' }}>Sell My Car Free</a>
        <a href="/advertise-car-for-sale" style={{ background: '#111', color: 'white', padding: '10px 16px', borderRadius: 8, textDecoration: 'none' }}>Advertise Car For Sale</a>
        <a href="/sell-my-car-fast" style={{ background: '#00a651', color: 'white', padding: '10px 16px', borderRadius: 8, textDecoration: 'none' }}>Sell My Car Fast</a>
      </p>
      <p style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <a href="/buy-a-car-preston" style={{ background: '#111', color: 'white', padding: '10px 16px', borderRadius: 8, textDecoration: 'none' }}>Buy a Car in Preston</a>
        <a href="/cars-for-sale-near-me" style={{ background: '#444', color: 'white', padding: '10px 16px', borderRadius: 8, textDecoration: 'none' }}>Cars For Sale Near Me</a>
        <a href="/cheap-finance-car" style={{ background: '#6b21a8', color: 'white', padding: '10px 16px', borderRadius: 8, textDecoration: 'none' }}>Cheap Finance Car</a>
      </p>
      <p><a href="/add-car" style={{ background: '#0070f3', color: 'white', padding: '10px 16px', borderRadius: 8, textDecoration: 'none' }}>+ List My Car Free</a> | <a href="/login">Log In</a> | <a href="/saved">♥ My Saved Cars</a> | <a href="/garage">🏠 My Garage</a> | <a href="/seller">🏪 Seller Dashboard</a></p>
      <form method="get" style={{ border: '1px solid #ddd', padding: 16, borderRadius: 12, margin: '20px 0', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input name="q" defaultValue={q} placeholder="Search e.g. Tesla Model 3" style={{ padding: 12, borderRadius: 8, border: '1px solid #ccc', flex: 1 }} />
        <input name="maxPrice" type="number" defaultValue={sp?.maxPrice || ''} placeholder="Max price £" style={{ padding: 10, fontSize: 15, flex: 1, minWidth: 110 }} />
        <input name="maxMileage" type="number" defaultValue={sp?.maxMileage || ''} placeholder="Max mileage" style={{ padding: 10, fontSize: 15, flex: 1, minWidth: 110 }} />
        <input name="minYear" type="number" defaultValue={sp?.minYear || ''} placeholder="Min year e.g. 2020" style={{ padding: 10, fontSize: 15, flex: 1, minWidth: 110 }} />
        <button type="submit" style={{ padding: '10px 20px', background: '#111', color: 'white', border: 'none', borderRadius: 8 }}>Search</button>
        <a href="/" style={{ padding: '10px 12px', textDecoration: 'none', color: '#555' }}>Clear</a>
      </form>
      <SaveSearchButton q={q} maxPrice={sp?.maxPrice} maxMileage={sp?.maxMileage} minYear={sp?.minYear} />
      <form action={async (formData: FormData) => {
  'use server'
  const { supabase } = await import('../lib/supabase')
  // This runs on server - we can't get user here easily in this simple version,
  // so we save via client below instead. This is a placeholder that redirects to saved page.
}} style={{ display: 'none' }}></form>
      <AuthGate>
        <h2>Live Cars From Database: {listings?.length} {q && `(for "${q}")`}</h2>
        {(listings || []).length === 0 && <p>No cars match those filters.</p>}
        {listings?.map((car: any) => (
          <Link key={car.id} href={`/car/${car.id}`} style={{ textDecoration: 'none', color: 'black' }}>
            <div style={{ display: 'flex', gap: 16, border: '1px solid #ddd', padding: 16, marginBottom: 16, borderRadius: 12 }}>
              <div style={{ width: 180, height: 120, background: '#eee', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>🚗</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}><SaveButton listingId={car.id} /></div>
                <h3 style={{ margin: '0 0 6px' }}>{car.title}</h3>
                <p style={{ margin: '0 0 6px', color: '#333' }}>{car.year} • {car.mileage} miles • {car.postcode}</p>
                <p style={{ margin: '0 0 10px', fontSize: 22, fontWeight: 'bold' }}>£{car.price}</p>
                <p style={{ margin: 0, fontSize: 14, background: '#f0f7ff', padding: '8px 10px', borderRadius: 6 }}>🔒 Offer £{car.offer_min}+ to unlock slots | 📞 Call £{car.slot_fee_call} | 👀 Viewing £{car.slot_fee_viewing} — Click to make offer →</p>
              </div>
            </div>
          </Link>
        ))}
      </AuthGate>
    </main>
  )
}