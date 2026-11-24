'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function SellerPage() {
  const [myCars, setMyCars] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { setLoading(false); return }
    const { data: all } = await supabase.from('listings').select('*').order('created_at', { ascending: false })
    const mine = (all || []).filter((c: any) => !c.user_id || c.user_id === session.user.id)
    setMyCars(mine)
    const ids = mine.map((c: any) => c.id)
    if (ids.length > 0) {
      const { data: bk } = await supabase.from('bookings').select('*').in('listing_id', ids).order('created_at', { ascending: false })
      setBookings(bk || [])
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function setStatus(id: string, newStatus: string) {
    if (newStatus === 'sold' && !confirm('Mark this car as SOLD? This stops the 1/day clock.')) return
    if (newStatus === 'paused' && !confirm('Pause this advert? The 1/day clock stops while paused.')) return
    await supabase.from('listings').update({ status: newStatus }).eq('id', id)
    load()
  }

  async function deleteCar(id: string) {
    if (!confirm('Delete this listing? This cannot be undone.')) return
    await supabase.from('listings').delete().eq('id', id)
    load()
  }

  if (loading) return <main style={{ padding: 24, fontFamily: 'sans-serif' }}>Loading your seller dashboard...</main>

  return (
    <main style={{ fontFamily: 'sans-serif', padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <p><Link href="/">Back to cars</Link> | <Link href="/garage">My Garage</Link></p>
      <h1>Seller Dashboard</h1>
      <p>Your cars, your bookings, your advert clock. List free, 1/day accrues, billed at the end, max 60 days.</p>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <Link href="/add-car" style={{ background: '#00a651', color: 'white', padding: '12px 18px', borderRadius: 8, textDecoration: 'none', fontWeight: 'bold' }}>+ List Another Car Free</Link>
        <Link href="/saved" style={{ background: '#111', color: 'white', padding: '12px 18px', borderRadius: 8, textDecoration: 'none' }}>My Saved Cars</Link>
      </div>

      <h2>My Listings ({myCars.length})</h2>
      {myCars.length === 0 && <p>No listings yet. <Link href="/add-car">List your first car free</Link></p>}

      {myCars.map((car: any) => {
        const daysLive = car.created_at ? Math.max(0, Math.floor((new Date().getTime() - new Date(car.created_at).getTime()) / 86400000) + 1) : 1
        const owed = Math.min(daysLive, 60) * 1
        const carBookings = bookings.filter((b: any) => b.listing_id === car.id)
        return (
          <div key={car.id} style={{ border: '1px solid #ddd', padding: 16, borderRadius: 12, marginBottom: 12 }}>
            <h3 style={{ margin: '0 0 6px' }}>{car.title} - £{car.price}</h3>
            <p style={{ margin: '0 0 8px', color: '#555' }}>{car.year} - {car.mileage} miles - {car.postcode} - Offer from £{car.offer_min}</p>
            <p style={{ margin: '0 0 8px', background: '#fffbeb', border: '1px solid #fde68a', padding: '8px 12px', borderRadius: 8 }}>
              Advert live: <b>{daysLive} day(s)</b> - Accrued: <b>£{owed}.00</b> - Max 60 days - Billed automatically at end - Pause stops clock
            </p>
            <p style={{ margin: '0 0 8px' }}>Bookings on this car: <b>{carBookings.length}</b></p>
            <p style={{ margin: 0, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ background: car.status === 'sold' ? '#dcfce7' : car.status === 'paused' ? '#fef3c7' : '#d1fae5', padding: '4px 10px', borderRadius: 20, fontSize: 13, fontWeight: 'bold' }}>
                {car.status === 'sold' ? 'SOLD - Clock stopped' : car.status === 'paused' ? 'PAUSED - Clock stopped' : 'LIVE'}
              </span>
              <Link href={`/car/${car.id}`} style={{ background: '#111', color: 'white', padding: '8px 14px', borderRadius: 8, textDecoration: 'none' }}>View Listing</Link>
              <Link href={`/add-slots?car=${car.id}`} style={{ background: '#0070f3', color: 'white', padding: '8px 14px', borderRadius: 8, textDecoration: 'none' }}>+ Add Slots</Link>
              {car.status !== 'paused' && car.status !== 'sold' && <button onClick={() => setStatus(car.id, 'paused')} style={{ background: 'white', border: '1px solid #ccc', padding: '8px 14px', borderRadius: 8, cursor: 'pointer' }}>Pause Advert</button>}
              {car.status === 'paused' && <button onClick={() => setStatus(car.id, 'live')} style={{ background: '#00a651', color: 'white', border: 'none', padding: '8px 14px', borderRadius: 8, cursor: 'pointer' }}>Resume</button>}
              {car.status !== 'sold' && <button onClick={() => setStatus(car.id, 'sold')} style={{ background: '#111', color: 'white', border: 'none', padding: '8px 14px', borderRadius: 8, cursor: 'pointer' }}>Mark Sold</button>}
              <button onClick={() => deleteCar(car.id)} style={{ background: 'white', border: '1px solid #ccc', padding: '8px 14px', borderRadius: 8, cursor: 'pointer' }}>Delete</button>
            </p>
          </div>
        )
      })}

      <h2 style={{ marginTop: 32 }}>All Bookings ({bookings.length})</h2>
      <p>Call £10 - Viewing £30. Credited if they buy. Refunded if they turn up but don’t buy. Kept only on no-show.</p>
      {bookings.length === 0 && <p>No bookings yet. When a buyer makes a pre-qualified offer and books a slot, they will appear here.</p>}
      {bookings.map((b: any) => {
        const car = myCars.find((c: any) => c.id === b.listing_id)
        return (
          <div key={b.id} style={{ border: '1px solid #ddd', padding: 14, borderRadius: 12, marginBottom: 10 }}>
            <b>{car?.title || 'Car'}</b> - {b.slot_type || b.type || 'Slot'} - {b.slot_date || b.date || ''} {b.slot_time || b.time || ''}
            <p style={{ margin: '6px 0 0', color: '#555' }}>Buyer: {b.buyer_name || b.name || b.buyer_email || '-'} - Offer: £{b.offer_amount || b.offer || '-'} - Status: {b.status || 'Booked'}</p>
          </div>
        )
      })}
    </main>
  )
}