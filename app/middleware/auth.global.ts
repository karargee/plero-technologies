const PROTECTED_ROUTES = ['/dashboard', '/home', '/sell', '/orders', '/profile']

/**
 * App views require a session. The check runs on the server too so protected
 * markup is never sent to an anonymous client.
 */
export default defineNuxtRouteMiddleware(to => {
  const isProtected = PROTECTED_ROUTES.some(route => to.path === route || to.path.startsWith(`${route}/`))
  if (!isProtected) return

  if (import.meta.server) return navigateTo('/login')

  const signedIn = Boolean(localStorage.getItem('plero_user'))
  if (!signedIn) return navigateTo('/login')
})
