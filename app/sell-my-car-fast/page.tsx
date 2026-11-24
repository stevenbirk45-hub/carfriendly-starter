import Link from 'next/link'

export default function Page() {
  return (
    <main style={{ fontFamily: 'sans-serif', padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <p><Link href="/">← Back to CarFriendly</Link></p>
      <h1 style={{ fontSize: 38, lineHeight: 1.1 }}>Sell My Car Fast — Get a Real Buyer This Week</h1>
      <p style={{ fontSize: 18, color: '#333' }}>Want it gone fast? Price it for a fast sale, set a low Offer Gate, and open lots of slots this week. Faster sale = lower commission too — 0.9% if sold in 7 days.</p>
      <Link href="/add-car" style={{ display: 'inline-block', background: '#00a651', color: 'white', padding: '14px 24px', borderRadius: 8, textDecoration: 'none', fontWeight: 'bold', fontSize: 18 }}>Sell My Car Fast →</Link>

      <h2 style={{ marginTop: 32 }}>The 3-day fast-sale playbook</h2>
      <ol style={{ fontSize: 17, lineHeight: 1.7 }}>
        <li><b>Day 1 — List it today.</b> 20 photos, honest damage photo, fair price. Set your Offer Gate £300-£500 below asking so real buyers unlock instantly.</li>
        <li><b>Day 1-2 — Open 6-8 slots.</b> 3 Calls + 3 Viewings across evenings and weekend. More slots = more chances to sell.</li>
        <li><b>Day 2-3 — Accept a qualifying offer, book a viewing.</b> Buyer’s £30 viewing fee is credited off the price. If they buy, partner bank holds the money, 24hr cooling-off, then you get paid.</li>
      </ol>

      <div style={{ background: '#fff7e6', padding: 16, borderRadius: 12 }}>
        <h3>Why fast sellers win here</h3>
        <p>Buyers who’ve already made an offer and paid a slot fee turn up. They’re not browsing — they’re buying. No “I’ll think about it” from 20 strangers.</p>
      </div>

      <h3>What if it doesn’t sell in 7 days?</h3>
      <p>You’re still only on £1/day. Drop the price a little, add more slots, or pause — clock stops. You’re never locked in.</p>
      <p><Link href="/add-car">List It Today — Free →</Link> | <Link href="/sell-my-car-free">Or list free with no rush</Link></p>
    </main>
  )
}