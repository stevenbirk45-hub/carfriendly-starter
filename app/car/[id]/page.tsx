'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function CarPage({ params }: any) {
  const [car, setCar] = useState<any>(null)
  const [slots, setSlots] = useState<any[]>([])
  const [offer, setOffer] = useState('')
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [id, setId] = useState('')

  useEffect(() => {
    async function load() {
      const p = await params
      setId(p.id)
      const { data: c } = await supabase.from('listings').select('*').eq('id', p.id).maybeSingle()
      setCar(c)
      const { data: s } = await supabase.from('slots').select('*').eq('listing_id', p.id).order('slot_date')
      setSlots(s || [])
    }
    load()
  }, [params])

  async function book(slot: any) {
    if (!email) { setMsg('Please type your email first.'); return }
    if (!offer) { setMsg('Please type your offer first.'); return }
    const fee = String(slot.type || '').toLowerCase() === 'call' ? 0 : 30
    const { error: bErr } = await supabase.from('bookings').insert([{
      slot_id: slot.id,
      buyer_id: email,
      buyer_email: email,
      offer_amount: Number(offer),
      fee: fee,
      status: 'booked'
    }])
    if (bErr) { setMsg('Booking failed: ' + bErr.message); return }
    await supabase.from('slots').update({ is_booked: true }).eq('id', slot.id)
    setMsg(fee === 0 ? 'Booked! Call is FREE - check My Bookings.' : 'Booked! Fee £30 - check My Bookings.')
    const { data: s } = await supabase.from('slots').select('*').eq('listing_id', id).order('slot_date')
    setSlots(s || [])
  }

  if (!car) return <main style={{ padding: 24, fontFamily: 'sans-serif' }}>Loading car...</main>
  const unlocked = offer !== '' && Number(offer) >= Number(car.offer_min)

  return (
    <main style={{ fontFamily: 'sans-serif', padding: 24, maxWidth: 700, margin: '0 auto' }}>
      <p><a href="/">Back to cars</a> | <a href="/bookings">My Bookings</a></p>
      <h1>{car.title}</h1>
      <p>{car.year} - {car.mileage} miles - {car.postcode}</p>
      <p style={{ fontSize: 28, fontWeight: 'bold' }}>£{car.price}</p>
      <div style={{ border: '1px solid #ddd', padding: 16, borderRadius: 12, marginBottom: 16 }}>
        <h3 style={{ marginTop: 0 }}>Make a Pre-Qualifying Offer</h3>
        <p>Seller will only unlock slots if your offer is <b>£{car.offer_min}</b> or more.</p>
        <input value={offer} onChange={e => setOffer(e.target.value)} type="number" placeholder={'e.g. ' + car.offer_min} style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc', marginRight: 8 }} />
        <span>{unlocked ? 'Offer accepted - slots unlocked below' : 'Type an offer to unlock slots'}</span>
      </div>
      <div style={{ border: '2px solid green', padding: 16, borderRadius: 12 }}>
        <h3 style={{ marginTop: 0 }}>Book a Slot</h3>
        <p>Your email (this is how we find your booking):</p>
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="abc@carfriendly.com" style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc', width: '100%', marginBottom: 12 }} />
        {msg && <p style={{ fontWeight: 'bold' }}>{msg}</p>}
        {slots.length === 0 && <p>All slots for this car are booked / none added yet.</p>}
        {slots.map((s: any) => (
          <div key={s.id} style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 10, borderBottom: '1px solid #eee', paddingBottom: 10 }}>
            <span><b>{s.type}</b> - {s.slot_date} at {s.slot_time} - Fee {String(s.type || '').toLowerCase() === 'call' ? 'FREE' : '£30'} - {s.is_booked ? 'Booked' : 'Free'}</span>
            <button onClick={() => book(s)} disabled={s.is_booked || !unlocked} style={{ background: s.is_booked ? '#ccc' : '#0070f3', color: 'white', padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>
              {s.is_booked ? 'Booked' : unlocked ? 'Book This Slot' : 'Make Offer First'}
            </button>
          </div>
        ))}
        {!unlocked && <p style={{ color: '#555' }}>Tip: type offer {car.offer_min} or more above to unlock the Book buttons.</p>}
      </div>
    </main>
  )
}