import { supabase } from '../../lib/supabase'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AddSlots({ searchParams }: any) {
  const sp = await searchParams
  const carId = sp?.carId || ''

  const { data: listings } = await supabase.from('listings').select('id, title')

  async function addSlot(formData: FormData) {
    'use server'
    const listing_id = formData.get('listing_id') as string
    const type = formData.get('type') as string
    const slot_date = formData.get('slot_date') as string
    const slot_time = formData.get('slot_time') as string
    await supabase.from('slots').insert([{ listing_id, type, slot_date, slot_time }])
    redirect(`/car/${listing_id}?offer=999999`)
  }

  return (
    <main style={{ fontFamily: 'sans-serif', padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <p><Link href="/">← Back to cars</Link></p>
      <h1>Add Slots For Your Car</h1>
      <p>Pick what slots you want to offer. Buyers can only book these. No cold calls, no time-wasters.</p>
      <form action={addSlot} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label>Which car?</label>
        <select name="listing_id" required defaultValue={carId} style={{ padding: 12, fontSize: 16 }}>
  <option value="">Choose a car...</option>
  {listings?.map((c: any) => <option key={c.id} value={c.id}>{c.title}</option>)}
</select>
        <label>Type</label>
        <select name="type" style={{ padding: 12, fontSize: 16 }}>
          <option value="Viewing">Viewing — £30 fee</option>
          <option value="Call">Call — £10 fee</option>
        </select>
        <label>Date — e.g. Mon 23 Nov</label>
        <input name="slot_date" placeholder="Mon 23 Nov" required style={{ padding: 12, fontSize: 16 }} />
        <label>Time — e.g. 10:00</label>
        <input name="slot_time" placeholder="10:00" required style={{ padding: 12, fontSize: 16 }} />
        <button type="submit" style={{ padding: 14, fontSize: 18, background: '#0070f3', color: 'white', border: 'none', borderRadius: 8 }}>Add This Slot</button>
      </form>
    </main>
  )
}