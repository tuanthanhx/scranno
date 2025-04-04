import { useRouter, useRoute } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'

export function useNavigation() {
  const router = useRouter()
  const route = useRoute()

  // Navigate to a route
  const navigateTo = (to: string | RouteLocationRaw, replace = false) => {
    const destination = typeof to === 'string' ? { path: to } : to
    return replace
      ? router.replace(destination)
      : router.push(destination)
  }

  // Check if current route matches
  const isActiveRoute = (path: string): boolean => {
    return route.path === path
  }

  // Get current route info
  const getCurrentRoute = () => ({
    path: route.path,
    name: route.name,
    params: route.params,
    query: route.query
  })

  // Common navigation helpers
  const goBack = () => router.back()
  const goForward = () => router.forward()
  const goHome = () => navigateTo('/')
  const reload = () => router.go(0)

  return {
    navigateTo,
    goBack,
    goForward,
    goHome,
    reload,
    isActiveRoute,
    getCurrentRoute,
    currentRoute: route // Direct access to route object
  }
}
