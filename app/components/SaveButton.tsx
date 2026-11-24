'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function SaveButton({ listingId }: { listingId: string }) {
  const [saved, setSaved] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user?.id || null)
      if (data.session?.user?.id) {
        supabase.from('saved_cars').select('id').eq('user_id', data.session.user.id).eq('listing_id', listingId).maybeSingle().then(({ data }) => {
          setSaved(!!data)
        })
      }
    })
  }, [listingId])

  async function toggle() {
    if (!userId) { window.location.href = '/login'; return }
    if (saved) {
      await supabase.from('saved_cars').delete().eq('user_id', userId).eq('listing_id', listingId)
      setSaved(false)
    } else {
      await supabase.from('saved_cars').insert([{ user_id: userId, listing_id: listingId }])
      setSaved(true)
    }
  }

  return (
    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle() }} style={{ background: saved ? '#00a651' : '#fff', color: saved ? 'white' : '#111', border: '1px solid #111', padding: '8px 14px', borderRadius: 20, cursor: 'pointer', fontWeight: 'bold' }}>
      {saved ? '♥ Saved' : '♡ Save'}
    </button>
  )
}