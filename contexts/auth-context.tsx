"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabaseAuth } from "@/lib/supabase/auth"

interface AuthContextType {
  currentUser: User | null
  loading: boolean
  signup: (email: string, password: string, displayName: string) => Promise<User>
  login: (email: string, password: string) => Promise<User>
  logout: () => Promise<void>
  loginWithGoogle: () => Promise<User>
  loginWithFacebook: () => Promise<User>
  linkWithGoogle: () => Promise<void>
  linkWithFacebook: () => Promise<void>
  unlinkProvider: (providerId: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { data: { subscription } } = supabaseAuth.onAuthStateChange((event, session) => {
      setCurrentUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signup(email: string, password: string, displayName: string) {
    try {
      const { data, error } = await supabaseAuth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
        },
      })
      if (error) throw error
      return data.user as User
    } catch (error: any) {
      console.error("Error in signup:", error)
      throw new Error(error.message || "Failed to create account")
    }
  }

  async function login(email: string, password: string) {
    try {
      const { data, error } = await supabaseAuth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return data.user as User
    } catch (error: any) {
      console.error("Error in login:", error)
      throw new Error(error.message || "Failed to sign in")
    }
  }

  async function logout() {
    try {
      await supabaseAuth.signOut()
    } catch (error: any) {
      console.error("Error in logout:", error)
      throw new Error(error.message || "Failed to sign out")
    }
  }

  async function loginWithGoogle() {
    try {
      const { data, error } = await supabaseAuth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      return currentUser as User
    } catch (error: any) {
      console.error("Error in Google login:", error)
      throw new Error(error.message || "Failed to sign in with Google")
    }
  }

  async function loginWithFacebook() {
    try {
      const { data, error } = await supabaseAuth.signInWithOAuth({
        provider: "facebook",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      return currentUser as User
    } catch (error: any) {
      console.error("Error in Facebook login:", error)
      throw new Error(error.message || "Failed to sign in with Facebook")
    }
  }

  async function linkWithGoogle() {
    throw new Error("Link provider not yet implemented for Supabase")
  }

  async function linkWithFacebook() {
    throw new Error("Link provider not yet implemented for Supabase")
    if (!currentUser) throw new Error("No user logged in")

    try {
      const provider = new FacebookAuthProvider()
      const { linkWithPopup } = await import("firebase/auth")
      await linkWithPopup(currentUser, provider)
    } catch (error: any) {
      console.error("Error linking Facebook account:", error)
      throw new Error(error.message || "Failed to link Facebook account")
    }
  }

  async function unlinkProvider(providerId: string) {
    if (!currentUser) throw new Error("No user logged in")

    try {
      const { unlink } = await import("firebase/auth")
      await unlink(currentUser, providerId)
    } catch (error: any) {
      console.error("Error unlinking provider:", error)
      throw new Error(error.message || "Failed to unlink account")
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value: AuthContextType = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    loginWithGoogle,
    loginWithFacebook,
    linkWithGoogle,
    linkWithFacebook,
    unlinkProvider,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
