import { supabase } from '../../../../lib/supabase'
import Link from 'next/link'

export default async function BuyPage({ params, searchParams }: any) {
  const { id } = await params
  const sp = await searchParams
  const days = Number(sp?.days || 5)
  const slotFeePaid = Number(sp?.slotFee || 30)

  const { data: car } = await supabase.from('listings').select('*').eq('id', id).single()
  if (!car) return <main style={{ padding: 24 }}>Car not found. <Link href="/">Back</Link></main>

  // Days-based commission — your CarFriendly model
  let rate = 0.009
  if (days >= 46) rate = 0.022
  else if (days >= 22) rate = 0.019
  else if (days >= 8) rate = 0.014

  const commission = Math.min(car.price * rate, 499)
  const sellerGets = car.price - commission
  const buyerStillToPay = car.price - slotFeePaid

  return (
    <main style={{ fontFamily: 'sans-serif', padding: 24, maxWidth: 700, margin: '0 auto' }}>
      <p><Link href={`/car/${car.id}?offer=${car.offer_min}`}>← Back to {car.title}</Link></p>
      <h1>Buy {car.title}</h1>
      <p>{car.year} • {car.mileage} miles • {car.postcode}</p>

      <div style={{ background: '#f0f7ff', border: '1px solid #0070f3', padding: 16, borderRadius: 12, marginBottom: 16 }}>
        <h3 style={{ marginTop: 0 }}>🔒 Partner Bank Escrow — Site Never Touches Money</h3>
        <p style={{ margin: 0, fontSize: 14 }}>Your money goes to a partner bank, not to CarFriendly and not to the seller. The bank holds it. After delivery + 24hr cooling-off, the bank auto-releases it. No manual release by the site.</p>
      </div>

      <div style={{ border: '1px solid #ddd', padding: 16, borderRadius: 12, marginBottom: 16 }}>
        <h3>How many days has this car been listed?</h3>
        <p style={{ fontSize: 14, color: '#555' }}>Commission is days-based. Faster sale = lower commission. This is what the seller pays, not you.</p>
        <form method="get" style={{ display: 'flex', gap: 8 }}>
          <input type="hidden" name="slotFee" value={slotFeePaid} />
          <input name="days" type="number" defaultValue={days} style={{ padding: 12, fontSize: 16, flex: 1 }} />
          <button type="submit" style={{ padding: '12px 20px', background: '#0070f3', color: 'white', border: 'none', borderRadius: 8 }}>Recalculate</button>
        </form>
        <p style={{ fontSize: 13, marginTop: 8 }}>1-7 days = 0.9% &nbsp;|&nbsp; 8-21 days = 1.4% &nbsp;|&nbsp; 22-45 days = 1.9% &nbsp;|&nbsp; 46+ days = 2.2% — Capped at £499</p>
      </div>

      <div style={{ border: '1px solid #ddd', padding: 16, borderRadius: 12 }}>
        <h3>💰 Escrow Breakdown</h3>
        <table style={{ width: '100%', fontSize: 16, borderCollapse: 'collapse' }}>
          <tbody>
            <tr><td style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>Asking price</td><td style={{ textAlign: 'right' }}>£{car.price.toLocaleString()}</td></tr>
            <tr><td style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>Slot fee you already paid (credited off price)</td><td style={{ textAlign: 'right', color: 'green' }}>- £{slotFeePaid}</td></tr>
            <tr><td style={{ padding: '8px 0', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>You still pay to partner bank now</td><td style={{ textAlign: 'right', fontWeight: 'bold' }}>£{buyerStillToPay.toLocaleString()}</td></tr>
            <tr><td style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>Partner bank holds (24hr cooling-off after delivery)</td><td style={{ textAlign: 'right' }}>£{car.price.toLocaleString()}</td></tr>
            <tr><td style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>CarFriendly commission ({days} days = {(rate * 100).toFixed(1)}%, capped at £499)</td><td style={{ textAlign: 'right' }}>- £{commission.toFixed(2)}</td></tr>
            <tr><td style={{ padding: '8px 0', fontWeight: 'bold', color: 'green' }}>Seller receives after auto-release</td><td style={{ textAlign: 'right', fontWeight: 'bold', color: 'green' }}>£{sellerGets.toFixed(2)}</td></tr>
          </tbody>
        </table>
        <p style={{ fontSize: 13, color: '#555' }}>If you and the seller agree there's an issue after delivery, you sort it directly during the 24hrs. If no issue, bank auto-releases. Cash / bank-transfer direct sales = £0 commission — commission only on managed escrow sales.</p>
        <button style={{ width: '100%', padding: 16, fontSize: 18, background: '#00a651', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Pay £{buyerStillToPay.toLocaleString()} to Partner Bank Escrow (Demo — No Real Payment)</button>
        <p style={{ fontSize: 12, textAlign: 'center', color: '#888' }}>Demo button only. In the live site this connects to the partner bank, not to CarFriendly.</p>
      </div>
    </main>
  )
}