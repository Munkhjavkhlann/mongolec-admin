import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  isActive: boolean
  createdAt: any
  updatedAt: any
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
        try {
          // Call GraphQL logout mutation to clear httpOnly cookie
          const response = await fetch('http://localhost:4000/graphql', {
            method: 'POST',
            credentials: 'include', // Include cookies
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: 'mutation Logout { logout { success message } }'
            }),
          })

          const result = await response.json()
          if (result.data?.logout?.success) {
            console.log('Logged out successfully')
          }
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          // Clear user state regardless of backend response
          get().clearUser()

          // Redirect to sign-in
          window.location.href = '/sign-in'
        }
      },
    }),
    {
      name: 'auth-store-secure', // DevTools name
    }
  )
)