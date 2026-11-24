import { supabase } from '../../lib/supabase'
import { redirect } from 'next/navigation'

export default function AddCar() {
  async function addCar(formData: FormData) {
    'use server'
    const title = formData.get('title') as string
    const price = Number(formData.get('price'))
    const mileage = Number(formData.get('mileage'))
    const year = Number(formData.get('year'))
    const postcode = formData.get('postcode') as string
    const offer_min = Number(formData.get('offer_min'))

    await supabase.from('listings').insert([{ title, price, mileage, year, postcode, offer_min, slot_fee_viewing: 30, slot_fee_call: 10 }])
    redirect('/')
  }

  return (
    <main style={{ fontFamily: 'sans-serif', padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <h1>Add Your Car — Free</h1>
      <p>Free to list. £1/day accrues, only billed when it sells or ends. Max £60.</p>
      <form action={addCar} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input name="title" placeholder="e.g. Ford Focus Titanium" required style={{ padding: 12, fontSize: 16 }} />
        <input name="price" type="number" placeholder="Asking price £" required style={{ padding: 12, fontSize: 16 }} />
        <input name="mileage" type="number" placeholder="Mileage" required style={{ padding: 12, fontSize: 16 }} />
        <input name="year" type="number" placeholder="Year e.g. 2021" required style={{ padding: 12, fontSize: 16 }} />
        <input name="postcode" placeholder="Postcode e.g. PR1 1AA" required style={{ padding: 12, fontSize: 16 }} />
        <input name="offer_min" type="number" placeholder="Lowest offer you'll consider £ e.g. 20500" required style={{ padding: 12, fontSize: 16 }} />
        <button type="submit" style={{ padding: 14, fontSize: 18, background: '#0070f3', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>List My Car Free</button>
      </form>
      <p><a href="/">← Back to cars</a></p>
    </main>
  )
}