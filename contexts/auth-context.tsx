"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import * as supabaseAuth from "@/lib/supabase/auth";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<User>;
  loginWithFacebook: () => Promise<User>;
  linkWithGoogle: () => Promise<void>;
  linkWithFacebook: () => Promise<void>;
  unlinkProvider: (providerId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabaseAuth.onAuthStateChange((event, session) => {
      setCurrentUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signup(email: string, password: string, displayName: string) {
    try {
      const user = await supabaseAuth.signup(email, password);
      // supabase stores user metadata separately; you can set display name via profile table or update user metadata from server
      return user as User;
    } catch (error: any) {
      console.error("Error in signup:", error);
      throw new Error(error.message || "Failed to create account");
    }
  }

  async function login(email: string, password: string) {
    try {
      const user = await supabaseAuth.login(email, password);
      return user as User;
    } catch (error: any) {
      console.error("Error in login:", error);
      throw new Error(error.message || "Failed to sign in");
    }
  }

  async function logout() {
    try {
      await supabaseAuth.logout();
    } catch (error: any) {
      console.error("Error in logout:", error);
      throw new Error(error.message || "Failed to sign out");
    }
  }

  async function loginWithGoogle() {
    try {
      await supabaseAuth.loginWithOAuth("google");
      // Supabase redirects to provider; user will be set via auth state change
      return null as unknown as User;
    } catch (error: any) {
      console.error("Error in Google login:", error);
      throw new Error(error.message || "Failed to sign in with Google");
    }
  }

  async function loginWithFacebook() {
    try {
      await supabaseAuth.loginWithOAuth("facebook");
      return null as unknown as User;
    } catch (error: any) {
      console.error("Error in Facebook login:", error);
      throw new Error(error.message || "Failed to sign in with Facebook");
    }
  }

  async function linkWithGoogle() {
    // Supabase does not have a direct linkWithPopup equivalent client-side.
    // Attempting an OAuth flow will sign in via the provider. Linking accounts requires server-side handling.
    await supabaseAuth.loginWithOAuth("google");
  }

  async function linkWithFacebook() {
    await supabaseAuth.loginWithOAuth("facebook");
  }

  async function unlinkProvider(providerId: string) {
    // Unlinking providers is not supported client-side in Supabase in the same way as Firebase.
    throw new Error(
      "unlinkProvider is not supported for Supabase in this client wrapper",
    );
  }

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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
