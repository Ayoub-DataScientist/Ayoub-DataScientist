import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useSearchParams } from 'react-router-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import DOMPurify from 'dompurify'
import useSWR from 'swr'
import html2pdf from 'html2pdf.js'

const fetcher = async (id) => {
  const { data } = await supabase.from('sops').select('*').eq('id', id).single()
  return data
}

export default function GenerateSOP() {
  const [query] = useSearchParams()
  const id = query.get('id')
  const [prompt, setPrompt] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  const { data } = useSWR(id ? ['sop', id] : null, () => fetcher(id))
  const editor = useEditor({ extensions: [StarterKit], content: data?.content || '' })

  useEffect(() => {
    if (data) {
      setTitle(data.title)
      editor?.commands.setContent(data.content)
    }
  }, [data, editor])

  const handleGenerate = async () => {
    setLoading(true)
    const session = await supabase.auth.getSession()
    const res = await fetch('/functions/v1/generateSOP', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.data.session.access_token}`
      },
      body: JSON.stringify({ title: prompt, description: prompt })
    })
    const out = await res.json()
    const sanitized = DOMPurify.sanitize(out.sections)
    editor?.commands.setContent(sanitized)
    setTitle(prompt)
    setLoading(false)
  }

  const handleSave = async () => {
    const content = DOMPurify.sanitize(editor?.getHTML() || '')
    if (id) {
      await supabase.from('sops').update({ title, content }).eq('id', id)
    } else {
      await supabase.from('sops').insert({ title, content })
    }
  }

  const handleDownload = () => {
    const element = document.createElement('div')
    element.innerHTML = editor?.getHTML() || ''
    html2pdf().from(element).save(`${title || 'sop'}.pdf`)
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4" onContextMenu={(e) => e.preventDefault()}>
      <input className="w-full p-2 border" placeholder="Describe your business and the task" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <button className="bg-blue-600 text-white p-2" onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate SOP'}
      </button>
      <EditorContent editor={editor} className="bg-white p-2 border" />
      <div className="flex space-x-2">
        <button className="bg-green-600 text-white p-2" onClick={handleSave}>Save</button>
        <button className="bg-gray-600 text-white p-2" onClick={handleDownload}>Download PDF</button>
      </div>
    </div>
  )
}
