export interface PleroUser {
  name: string
  email: string
  phone?: string
}

const STORAGE_KEY = 'plero_user'

/**
 * Thin wrapper around the demo session stored in localStorage.
 * Swap the internals for real API calls without touching page code.
 */
export function useAuth() {
  const user = useState<PleroUser | null>('auth-user', () => null)

  const hydrate = () => {
    if (!import.meta.client) return
    if (user.value) return
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    try {
      user.value = JSON.parse(raw) as PleroUser
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  if (import.meta.client) onNuxtReady(hydrate)

  const signIn = (payload: { email: string; name?: string; phone?: string }) => {
    const next: PleroUser = {
      email: payload.email,
      name: payload.name || payload.email.split('@')[0] || 'Plero User',
      phone: payload.phone,
    }
    user.value = next
    if (import.meta.client) localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const signOut = () => {
    user.value = null
    if (import.meta.client) localStorage.removeItem(STORAGE_KEY)
    return navigateTo('/login')
  }

  const initials = computed(() => {
    const name = user.value?.name || 'Plero User'
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
    return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase()
  })

  return { user, initials, hydrate, signIn, signOut }
}
