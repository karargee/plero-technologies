// Tiny Supabase REST helpers for server routes (no SDK needed on the server).
import type { H3Event } from 'h3'

export function supabaseConfig(event: H3Event) {
  const cfg = useRuntimeConfig(event)
  const url = (cfg.public.supabaseUrl || '').replace(/\/+$/, '')
  return { url, anonKey: cfg.public.supabaseAnonKey, serviceKey: cfg.supabaseServiceKey }
}

/** GET rows from a table using the anon key (RLS applies). */
export async function supabaseSelect<T>(event: H3Event, table: string, query: string): Promise<T[]> {
  const { url, anonKey } = supabaseConfig(event)
  if (!url || !anonKey) throw new Error('Supabase not configured')
  return await $fetch<T[]>(`${url}/rest/v1/${table}?${query}`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    timeout: 5000,
  })
}

/** INSERT a row using the service-role key (server only). */
export async function supabaseInsert(event: H3Event, table: string, row: Record<string, unknown>) {
  const { url, serviceKey } = supabaseConfig(event)
  if (!url || !serviceKey) throw new Error('Supabase service key not configured')
  await $fetch(`${url}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Prefer: 'return=minimal',
    },
    body: row,
    timeout: 8000,
  })
}
