'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('signup')
  const [msg, setMsg] = useState('')
  const router = useRouter()

  async function handleSubmit(e: any) {
    e.preventDefault()
    setMsg('Working...')
    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMsg('Error: ' + error.message)
      else { setMsg('Account created! You can now log in.'); setMode('login') }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMsg('Error: ' + error.message)
      else { router.push('/'); router.refresh() }
    }
  }

  return (
    <main style={{ fontFamily: 'sans-serif', padding: 24, maxWidth: 500, margin: '0 auto' }}>
      <h1>{mode === 'signup' ? 'Create Your CarFriendly Account' : 'Log In to CarFriendly'}</h1>
      <p>Account required to browse cars. No account = listings stay locked. This is how we keep tyrekickers out.</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required style={{ padding: 12, fontSize: 16 }} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password (6+ characters)" required style={{ padding: 12, fontSize: 16 }} />
        <button type="submit" style={{ padding: 14, fontSize: 18, background: '#0070f3', color: 'white', border: 'none', borderRadius: 8 }}>{mode === 'signup' ? 'Create Account Free' : 'Log In'}</button>
      </form>
      <p style={{ color: '#0070f3', cursor: 'pointer' }} onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}>
        {mode === 'signup' ? 'Already have an account? Log in →' : 'No account? Create one free →'}
      </p>
      {msg && <p style={{ background: '#f0f7ff', padding: 12, borderRadius: 8 }}>{msg}</p>}
      <p><a href="/">← Back to home</a></p>
    </main>
  )
}