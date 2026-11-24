'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session)
      setEmail(data.session?.user?.email || '')
      setChecked(true)
    })
  }, [])

  if (!checked) return <p>Checking account...</p>

  if (!loggedIn) {
    return (
      <div style={{ border: '2px solid #111', padding: 24, borderRadius: 12, textAlign: 'center' }}>
        <h2>🔒 Create a free account to browse cars</h2>
        <p>CarFriendly is members-only. No account = listings stay locked. This is how we keep tyrekickers out.</p>
        <div style={{ filter: 'blur(6px)', pointerEvents: 'none', userSelect: 'none', opacity: 0.5 }}>
          {children}
        </div>
        <Link href="/login" style={{ display: 'inline-block', marginTop: 16, background: '#0070f3', color: 'white', padding: '12px 22px', borderRadius: 8, textDecoration: 'none', fontWeight: 'bold' }}>Create Free Account / Log In →</Link>
      </div>
    )
  }

  return (
    <div>
      <p style={{ background: '#e6ffed', padding: '10px 14px', borderRadius: 8 }}>✅ Logged in as <b>{email}</b> — <span style={{ color: '#0070f3', cursor: 'pointer' }} onClick={async () => { await supabase.auth.signOut(); window.location.reload() }}>Log out</span></p>
      {children}
    </div>
  )
}