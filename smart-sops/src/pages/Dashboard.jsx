import useSWR from 'swr'
import { supabase } from '../supabaseClient'
import { Link } from 'react-router-dom'

const fetcher = async () => {
  const { data } = await supabase.from('sops').select('*').order('created_at', { ascending: false })
  return data || []
}

export default function Dashboard() {
  const { data: sops = [], mutate } = useSWR('sops', fetcher)

  const handleDelete = async (id) => {
    await supabase.from('sops').delete().eq('id', id)
    mutate()
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl mb-4">My SOPs</h2>
      <Link className="text-blue-600" to="/generate">+ New SOP</Link>
      <ul className="mt-4 space-y-2">
        {sops.map((sop) => (
          <li key={sop.id} className="p-2 border flex justify-between items-center">
            <span>{sop.title}</span>
            <div className="space-x-2">
              <Link className="text-blue-600" to={`/generate?id=${sop.id}`}>View</Link>
              <button className="text-red-600" onClick={() => handleDelete(sop.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
