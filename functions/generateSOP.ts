// Supabase Edge Function to generate SOP using OpenAI
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai-edge'

const RATE_LIMIT = 60 // requests per hour
const buckets = new Map<string, { count: number; reset: number }>()

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const now = Date.now()
  const bucket = buckets.get(user.id) || { count: 0, reset: now + 3600_000 }
  if (now > bucket.reset) {
    bucket.count = 0
    bucket.reset = now + 3600_000
  }
  if (bucket.count >= RATE_LIMIT) {
    return new Response('Rate limit exceeded', { status: 429 })
  }
  bucket.count++
  buckets.set(user.id, bucket)

  const { title, description } = await req.json()
  const openai = new OpenAIApi(new Configuration({ apiKey: Deno.env.get('OPENAI_API_KEY')! }))
  const completion = await openai.createChatCompletion({
    model: 'gpt-4-turbo',
    messages: [{ role: 'system', content: `Generate an SOP titled ${title} for: ${description}` }]
  })
  const sections = completion.choices?.[0]?.message?.content || ''
  return new Response(JSON.stringify({ sections }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
