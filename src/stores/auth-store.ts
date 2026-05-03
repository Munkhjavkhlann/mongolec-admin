import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
  tenant?: { id: string; slug: string; name: string } | null
  roles?: { id: string; role: { id: string; name: string } }[]
}

type AuthActions = {
  setUser: (user: User | null) => void
  clearUser: () => void
  logout: () => Promise<void>
}

type AuthStore = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setLoading: (loading: boolean) => void
} & AuthActions

// Secure auth store - no token storage in frontend
export const useAuthStore = create<AuthStore>()(
  devtools(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setLoading: (loading: boolean) =>
        set({ isLoading: loading }),

      setUser: (user: User | null) =>
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false
        }),

      clearUser: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false
        }),

      logout: async () => {
        // Clear user state and redirect
        // The actual logout mutation will be called from the component
        get().clearUser()

        // Redirect to sign-in
        window.location.href = '/sign-in'
      },
    }),
    {
      name: 'auth-store-secure', // DevTools name
    }
  )
)