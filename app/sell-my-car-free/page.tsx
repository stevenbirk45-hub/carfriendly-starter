import Link from 'next/link'

export default function Page() {
  return (
    <main style={{ fontFamily: 'sans-serif', padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <p><Link href="/">← Back to CarFriendly</Link></p>
      <h1 style={{ fontSize: 38, lineHeight: 1.1 }}>Sell My Car Free — No Upfront Fees in Preston</h1>
      <p style={{ fontSize: 18, color: '#333' }}>List your car free. £1/day accrues, only billed when it sells, you end it, or after 60 days. Max £60. No tyrekickers — buyers must make a real offer to unlock your phone and slots.</p>
      <Link href="/add-car" style={{ display: 'inline-block', background: '#0070f3', color: 'white', padding: '14px 24px', borderRadius: 8, textDecoration: 'none', fontWeight: 'bold', fontSize: 18 }}>List My Car Free →</Link>

      <h2 style={{ marginTop: 32 }}>How it works</h2>
      <ol style={{ fontSize: 17, lineHeight: 1.7 }}>
        <li><b>List in 2 minutes</b> — photos, price, postcode, lowest offer you'll consider.</li>
        <li><b>Set your Offer Gate</b> — e.g. asking £8,950, auto-reject below £8,200. Low offers never reach you.</li>
        <li><b>Pick your slots</b> — you choose when you take Calls and Viewings. Mon-Sun, any time.</li>
        <li><b>Buyer pays a slot fee to book</b> — Call £10, Viewing £30. Credited off price if they buy. Kept by you only if they no-show.</li>
        <li><b>Sell via Partner Bank Escrow</b> — buyer pays the bank, not you. Bank holds it for 24hr cooling-off, then auto-releases. Commission only on escrow sales.</li>
      </ol>

      <div style={{ background: '#f0f7ff', padding: 16, borderRadius: 12 }}>
        <h3>What it costs</h3>
        <p>Free to list. £1/day while live, billed at the end. Max £60. Pause anytime — clock stops. Commission only if you sell via escrow: 0.9% if sold in 1-7 days, 1.4% in 8-21 days, 1.9% in 22-45 days, 2.2% after that, capped at £499. Cash / bank-transfer direct sale = £0 commission.</p>
      </div>

      <h3>Why sellers in Preston use CarFriendly</h3>
      <p>No cold calls. No “what’s your lowest price mate?” messages. No no-shows — they’ve paid to turn up. You stay in control of when and who sees the car.</p>
      <p><Link href="/add-car">List My Car Free →</Link> | <Link href="/sell-my-car-fast">Need it gone fast?</Link></p>
    </main>
  )
}