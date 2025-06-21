import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useSearchParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function GenerateSOP() {
  const [query] = useSearchParams();
  const id = query.get('id');
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSop = async () => {
      if (id) {
        const { data } = await supabase.from('sops').select('*').eq('id', id).single();
        if (data) {
          setTitle(data.title);
          setContent(data.content);
        }
      }
    };
    fetchSop();
  }, [id]);

  const handleGenerate = async () => {
    setLoading(true);
    // Placeholder for calling GPT-4 API
    const generated = `Generated SOP for: ${prompt}`;
    setTitle(prompt);
    setContent(generated);
    setLoading(false);
  };

  const handleSave = async () => {
    if (id) {
      await supabase.from('sops').update({ title, content }).eq('id', id);
    } else {
      await supabase.from('sops').insert({ title, content });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <input className="w-full p-2 border" placeholder="Describe your business and the task" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <button className="bg-blue-600 text-white p-2" onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate SOP'}
      </button>
      <ReactQuill theme="snow" value={content} onChange={setContent} className="bg-white" />
      <button className="bg-green-600 text-white p-2" onClick={handleSave}>Save</button>
    </div>
  );
}
