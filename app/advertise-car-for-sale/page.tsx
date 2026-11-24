import Link from 'next/link'

export default function Page() {
  return (
    <main style={{ fontFamily: 'sans-serif', padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <p><Link href="/">← Back to CarFriendly</Link></p>
      <h1 style={{ fontSize: 38, lineHeight: 1.1 }}>Advertise Car For Sale — Reach Real Buyers, Not Time-Wasters</h1>
      <p style={{ fontSize: 18, color: '#333' }}>Your advert only goes to buyers who’ve made a qualifying offer. No public phone number. No open DMs. Your slots, your rules.</p>
      <Link href="/add-car" style={{ display: 'inline-block', background: '#0070f3', color: 'white', padding: '14px 24px', borderRadius: 8, textDecoration: 'none', fontWeight: 'bold', fontSize: 18 }}>Advertise My Car →</Link>

      <h2 style={{ marginTop: 32 }}>What your advert includes</h2>
      <ul style={{ fontSize: 17, lineHeight: 1.7 }}>
        <li>20 photos + 1 video + damage photo — buyers trust honest adverts</li>
        <li>Full filters: postcode / distance, price, mileage, year, fuel, transmission, body, colour, ULEZ, MOT, owners</li>
        <li>Offer Gate — you set auto-reject / review / auto-accept prices</li>
        <li>Call & Viewing slots you control — no one can book outside your slots</li>
        <li>Saved-search alerts — buyers looking for your exact car get pinged instantly</li>
      </ul>

      <div style={{ background: '#e6ffed', padding: 16, borderRadius: 12 }}>
        <h3>The CarFriendly difference</h3>
        <p><b>【entity-AutoTrader¦canonical_name=AutoTrader】</b> = pay to list, then you get 100 messages from tyrekickers. <b>CarFriendly</b> = free to list, buyers must prove they’re serious with an offer + a paid slot fee before they can contact you.</p>
      </div>

      <h3>Perfect for</h3>
      <p>Private sellers in Preston & North West, small dealers who want qualified leads, anyone who’s sick of no-shows and low-ballers.</p>
      <p><Link href="/add-car">Advertise My Car Free →</Link></p>
    </main>
  )
}