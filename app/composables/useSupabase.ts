// Browser Supabase client for /admin (uses the public anon key; RLS protects data).
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export function useSupabase(): SupabaseClient | null {
  if (import.meta.server) return null
  if (client) return client
  const { supabaseUrl, supabaseAnonKey } = useRuntimeConfig().public
  if (!supabaseUrl || !supabaseAnonKey) return null
  client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: true, autoRefreshToken: true, storageKey: 'plero-admin-auth' },
  })
  return client
}
