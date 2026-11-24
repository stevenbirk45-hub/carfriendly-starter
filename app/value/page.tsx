'use client'
import { useEffect, useState, Suspense } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function ValueInner() {
  const sp = useSearchParams()
  const reg = sp.get('reg') || ''
  const [garageCar, setGarageCar] = useState<any>(null)
  const [similar, setSimilar] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session && reg) {
        const { data: gc } = await supabase.from('garage_cars').select('*').eq('user_id', session.user.id).eq('reg', reg).maybeSingle()
        setGarageCar(gc)
        if (gc?.title) {
          const firstWord = gc.title.split(' ')[0] // e.g. Ford
          const { data: listings } = await supabase.from('listings').select('*').ilike('title', `%${firstWord}%`)
          setSimilar(listings || [])
        }
      }
      setLoading(false)
    }
    load()
  }, [reg])

  if (loading) return <main style={{ padding: 24, fontFamily: 'sans-serif' }}>Checking value...</main>

  const avg = similar.length > 0 ? Math.round(similar.reduce((a: any, c: any) => a + Number(c.price), 0) / similar.length) : null

  return (
    <main style={{ fontFamily: 'sans-serif', padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <p><Link href="/garage">← Back to My Garage</Link></p>
      <h1>What’s It Worth? — {reg}</h1>
      {garageCar ? <p><b>{garageCar.title}</b> — MOT {garageCar.mot_due || '—'} • Tax {garageCar.tax_due || '—'}</p> : <p>No garage car found for {reg}.</p>}
      <div style={{ border: '2px solid #00a651', padding: 20, borderRadius: 12, background: '#f0fdf4' }}>
        <h2 style={{ margin: '0 0 8px' }}>Estimated Market Value</h2>
        {avg ? <p style={{ fontSize: 36, fontWeight: 'bold', margin: 0 }}>£{avg.toLocaleString()}</p> : <p>Not enough similar cars on CarFriendly yet to estimate.</p>}
        <p style={{ color: '#555' }}>Based on {similar.length} similar car(s) currently listed on CarFriendly in Preston / North West. This is a guide, not a formal valuation.</p>
        <p style={{ margin: 0 }}><Link href="/add-car" style={{ background: '#00a651', color: 'white', padding: '12px 18px', borderRadius: 8, textDecoration: 'none', fontWeight: 'bold' }}>List It Free On CarFriendly →</Link></p>
      </div>
      <h3 style={{ marginTop: 24 }}>Similar cars on CarFriendly</h3>
      {similar.length === 0 && <p>No similar cars listed yet.</p>}
      {similar.map((c: any) => (
        <Link key={c.id} href={`/car/${c.id}`} style={{ textDecoration: 'none', color: 'black' }}>
          <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 12, marginBottom: 10 }}>{c.title} — {c.year} • {c.mileage} miles • <b>£{c.price}</b> →</div>
        </Link>
      ))}
      <p style={{ color: '#777', fontSize: 13 }}>Tip: Save this page. Check back monthly — as more cars list, your estimate gets more accurate. That’s your Value Tracker.</p>
    </main>
  )
}

export default function ValuePage() {
  return <Suspense><ValueInner /></Suspense>
}