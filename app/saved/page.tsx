'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function SavedPage() {
  const [cars, setCars] = useState<any[]>([])
  const [searches, setSearches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { setLoading(false); return }
    const { data: saved } = await supabase.from('saved_cars').select('listing_id').eq('user_id', session.user.id)
    const ids = (saved || []).map((s: any) => s.listing_id)
    if (ids.length > 0) {
      const { data: listings } = await supabase.from('listings').select('*').in('id', ids)
      setCars(listings || [])
    }
    const { data: mySearches } = await supabase.from('saved_searches').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false })
    setSearches(mySearches || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function deleteSearch(id: string) {
    if (!confirm('Delete this saved search?')) return
    await supabase.from('saved_searches').delete().eq('id', id)
    load()
  }

  if (loading) return <main style={{ padding: 24, fontFamily: 'sans-serif' }}>Loading your garage...</main>

  return (
    <main style={{ fontFamily: 'sans-serif', padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <p><Link href="/">← Back to cars</Link> | <Link href="/garage">🏠 My Garage</Link></p>
      <h1>My Saved Cars — My Garage</h1>
      <p>Your shortlist + your alerts. This is your garage.</p>

      <h2>♥ Saved Cars ({cars.length})</h2>
      {cars.length === 0 && <p>No saved cars yet. Go to <Link href="/">home</Link> and click ♡ Save.</p>}
      {cars.map((car: any) => (
        <Link key={car.id} href={`/car/${car.id}`} style={{ textDecoration: 'none', color: 'black' }}>
          <div style={{ display: 'flex', gap: 16, border: '1px solid #ddd', padding: 16, marginBottom: 12, borderRadius: 12 }}>
            <div style={{ width: 120, height: 80, background: '#eee', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>🚗</div>
            <div><h3 style={{ margin: 0 }}>{car.title}</h3><p style={{ margin: '4px 0' }}>{car.year} • {car.mileage} miles • {car.postcode}</p><p style={{ margin: 0, fontWeight: 'bold', fontSize: 20 }}>£{car.price} — Offer £{car.offer_min}+ →</p></div>
          </div>
        </Link>
      ))}

      <h2 style={{ marginTop: 32 }}>🔔 Saved Searches — Alerts ({searches.length})</h2>
      <p>We’ll alert you when a new car matches. Instant = as soon as it’s listed.</p>
      {searches.length === 0 && <p>No saved searches yet. Search for something on <Link href="/">home</Link>, then click <b>🔔 Save This Search</b>.</p>}
      {searches.map((s: any) => (
        <div key={s.id} style={{ border: '1px solid #ddd', padding: 16, marginBottom: 12, borderRadius: 12 }}>
          <p style={{ margin: 0, fontWeight: 'bold', fontSize: 18 }}>“{s.search_text || 'Any car'}” {s.max_price ? `• Up to £${s.max_price}` : ''} {s.min_year ? `• ${s.min_year}+` : ''}</p>
          <p style={{ margin: '6px 0', color: '#555' }}>Alert: {s.frequency} • Saved {new Date(s.created_at).toLocaleDateString('en-GB')}</p>
          <p style={{ margin: 0 }}>
            <Link href={`/?q=${encodeURIComponent(s.search_text || '')}${s.max_price ? `&maxPrice=${s.max_price}` : ''}${s.max_mileage ? `&maxMileage=${s.max_mileage}` : ''}${s.min_year ? `&minYear=${s.min_year}` : ''}`} style={{ background: '#111', color: 'white', padding: '8px 14px', borderRadius: 8, textDecoration: 'none' }}>Run This Search →</Link>
            {' '}
            <button onClick={() => deleteSearch(s.id)} style={{ background: 'white', border: '1px solid #ccc', padding: '8px 14px', borderRadius: 8, cursor: 'pointer' }}>Delete</button>
          </p>
        </div>
      ))}

      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: 16, borderRadius: 12, marginTop: 24 }}>
        <h3 style={{ margin: '0 0 6px' }}>What happens next?</h3>
        <p style={{ margin: 0 }}>When a seller lists a car that matches your “ford” alert, you get pinged, you tap in, you make a pre-qualified offer, you book a slot. No tyrekickers, no endless scrolling.</p>
      </div>
    </main>
  )
}