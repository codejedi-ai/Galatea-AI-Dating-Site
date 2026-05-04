import { supabase } from "./client"
import type { User } from "@supabase/supabase-js"

export async function signup(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    return data.user as User | null
}

export async function login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data.user as User | null
}

export async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
}

export async function loginWithOAuth(provider: "google" | "facebook") {
    const { error } = await supabase.auth.signInWithOAuth({ provider })
    if (error) throw error
}

export function onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
}

export async function getCurrentUser() {
    const {
        data: { user },
    } = await supabase.auth.getUser()
    return user as User | null
}

export default {
    signup,
    login,
    logout,
    loginWithOAuth,
    onAuthStateChange,
    getCurrentUser,
}
