'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function BookingsPage() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const { data: bk } = await supabase.from('bookings').select('*').order('created_at', { ascending: false })
    const mine = bk || []
    if (mine.length === 0) { setRows([]); setLoading(false); return }
    const slotIds = mine.map((b: any) => b.slot_id)
    const { data: slots } = await supabase.from('slots').select('*').in('id', slotIds)
    const slotMap: any = {}
    ;(slots || []).forEach((s: any) => { slotMap[s.id] = s })
    const listingIds = (slots || []).map((s: any) => s.listing_id).filter(Boolean)
    const { data: listings } = await supabase.from('listings').select('*').in('id', listingIds)
    const carMap: any = {}
    ;(listings || []).forEach((c: any) => { carMap[c.id] = c })
    setRows(mine.map((b: any) => ({ booking: b, slot: slotMap[b.slot_id] || {}, car: carMap[slotMap[b.slot_id]?.listing_id] || null })))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  if (loading) return <main style={{ padding: 24, fontFamily: 'sans-serif' }}>Loading...</main>

  return (
    <main style={{ fontFamily: 'sans-serif', padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <p><a href="/">Back to cars</a> | <a href="/saved">My Saved Cars</a> | <a href="/garage">My Garage</a> | <a href="/seller">Seller Dashboard</a></p>
      <h1>My Bookings</h1>
      <p>Your calls and viewings. Call FREE - Viewing £30. Credited if you buy. Refunded if you turn up but don’t buy.</p>
      {rows.length === 0 && <div style={{ border: '1px solid #ddd', padding: 20, borderRadius: 12 }}><p>No bookings yet.</p><p>Go to <a href="/">home</a>, pick a car, type offer + your email, then Book This Slot.</p></div>}
      {rows.map((r: any) => (
        <div key={r.booking.id} style={{ border: '1px solid #ddd', padding: 16, borderRadius: 12, marginBottom: 12 }}>
          <h3 style={{ margin: '0 0 6px' }}>{r.car ? r.car.title : 'Car'} - £{r.car ? r.car.price : '-'}</h3>
          <p style={{ margin: '0 0 6px', color: '#555' }}>{r.slot.type} - {r.slot.slot_date} at {r.slot.slot_time} - Offer: £{r.booking.offer_amount} - Fee: £{r.booking.fee}</p>
          <p style={{ margin: 0 }}>Status: <b>{r.booking.status}</b> - Email: {r.booking.buyer_id}</p>
        </div>
      ))}
    </main>
  )
}