'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

function daysLeft(dateStr: string) {
  if (!dateStr) return null
  const diff = Math.ceil((new Date(dateStr).getTime() - new Date().getTime()) / 86400000)
  return diff
}

export default function GaragePage() {
  const [cars, setCars] = useState<any[]>([])
  const [reg, setReg] = useState('')
  const [title, setTitle] = useState('')
  const [mot, setMot] = useState('')
  const [tax, setTax] = useState('')
  const [service, setService] = useState('')
  const [insurance, setInsurance] = useState('')
  const [msg, setMsg] = useState('')

  async function load() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const { data } = await supabase.from('garage_cars').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false })
    setCars(data || [])
  }
  useEffect(() => { load() }, [])

  async function addCar(e: any) {
    e.preventDefault()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { window.location.href = '/login'; return }
    const { error } = await supabase.from('garage_cars').insert([{ user_id: session.user.id, reg: reg.toUpperCase(), title, mot_due: mot || null, tax_due: tax || null, service_due: service || null, insurance_due: insurance || null }])
    if (error) setMsg('Error: ' + error.message)
    else { setMsg('✅ Car added to your Garage'); setReg(''); setTitle(''); setMot(''); setTax(''); setService(''); setInsurance(''); load() }
  }

  async function del(id: string) {
    if (!confirm('Remove this car from your Garage?')) return
    await supabase.from('garage_cars').delete().eq('id', id)
    load()
  }

  return (
    <main style={{ fontFamily: 'sans-serif', padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <p><Link href="/">← Back to cars</Link> | <Link href="/saved">♥ My Saved Cars</Link></p>
      <h1>🏠 My Garage</h1>
      <p>Your cars, your MOT / Tax / Service / Insurance reminders, and what your car is worth. We remind you before it runs out — so you never get fined.</p>

      <form onSubmit={addCar} style={{ border: '1px solid #ddd', padding: 16, borderRadius: 12, marginBottom: 24 }}>
        <h3 style={{ marginTop: 0 }}>+ Add My Car</h3>
        <div style={{ display: 'grid', gap: 10 }}>
          <input value={reg} onChange={e => setReg(e.target.value)} placeholder="Reg e.g. AB12 CDE" required style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc' }} />
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Car e.g. Ford Focus Titanium 2019" required style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc' }} />
          <label>MOT Due <input type="date" value={mot} onChange={e => setMot(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc', width: '100%' }} /></label>
          <label>Tax Due <input type="date" value={tax} onChange={e => setTax(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc', width: '100%' }} /></label>
          <label>Service Due <input type="date" value={service} onChange={e => setService(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc', width: '100%' }} /></label>
          <label>Insurance Due <input type="date" value={insurance} onChange={e => setInsurance(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc', width: '100%' }} /></label>
        </div>
        <button style={{ marginTop: 12, background: '#00a651', color: 'white', padding: '12px 18px', borderRadius: 8, border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Add To My Garage →</button>
        {msg && <p>{msg}</p>}
      </form>

      {cars.length === 0 && <p>No cars in your Garage yet. Add your current car above — even if you didn’t buy it on CarFriendly.</p>}
      {cars.map((c: any) => {
        const motDays = c.mot_due ? daysLeft(c.mot_due) : null
        const taxDays = c.tax_due ? daysLeft(c.tax_due) : null
        return (
          <div key={c.id} style={{ border: '1px solid #ddd', padding: 16, borderRadius: 12, marginBottom: 12 }}>
            <h3 style={{ margin: 0 }}>{c.title} — {c.reg}</h3>
            <p style={{ margin: '8px 0' }}>
              {c.mot_due ? `🛠️ MOT: ${c.mot_due} ${motDays !== null ? (motDays < 0 ? `— OVERDUE by ${Math.abs(motDays)} days!` : motDays <= 30 ? `— Only ${motDays} days left!` : `— ${motDays} days left`) : ''} ` : 'MOT: — '}
              <br />
              {c.tax_due ? `💷 Tax: ${c.tax_due} ${taxDays !== null ? (taxDays < 0 ? `— OVERDUE!` : taxDays <= 30 ? `— Only ${taxDays} days left!` : `— ${taxDays} days left`) : ''}` : 'Tax: — '}
              <br />
              {c.service_due ? `🔧 Service: ${c.service_due}` : 'Service: — '} • {c.insurance_due ? `🛡️ Insurance: ${c.insurance_due}` : 'Insurance: — '}
            </p>
            <p style={{ margin: 0 }}>
              <Link href={`/value?reg=${c.reg}`} style={{ background: '#111', color: 'white', padding: '8px 14px', borderRadius: 8, textDecoration: 'none' }}>What’s It Worth? →</Link>{' '}
              <button onClick={() => del(c.id)} style={{ background: 'white', border: '1px solid #ccc', padding: '8px 14px', borderRadius: 8, cursor: 'pointer' }}>Remove</button>
            </p>
          </div>
        )
      })}
    </main>
  )
}