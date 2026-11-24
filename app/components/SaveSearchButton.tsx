'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function SaveSearchButton({ q, maxPrice, maxMileage, minYear }: any) {
  const [saved, setSaved] = useState(false)
  const [msg, setMsg] = useState('')

  async function save() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { window.location.href = '/login'; return }
    const { error } = await supabase.from('saved_searches').insert([{
      user_id: session.user.id,
      search_text: q || '',
      max_price: maxPrice ? Number(maxPrice) : null,
      max_mileage: maxMileage ? Number(maxMileage) : null,
      min_year: minYear ? Number(minYear) : null,
      frequency: 'Instant'
    }])
    if (error) setMsg('Error: ' + error.message)
    else { setSaved(true); setMsg('✅ Search saved! We’ll alert you when a new car matches.') }
  }

  return (
    <div style={{ margin: '8px 0 20px' }}>
      <button onClick={save} disabled={saved} style={{ background: saved ? '#00a651' : '#111', color: 'white', padding: '10px 16px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>
        {saved ? '✅ Search Saved' : '🔔 Save This Search — Alert Me When a Match Arrives'}
      </button>
      {msg && <p style={{ fontSize: 14 }}>{msg}</p>}
    </div>
  )
}