"use client"

import { Suspense, useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { Menu, X, User, Sun, Moon } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useTheme } from "next-themes"

function NavbarContent() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { currentUser, logout } = useAuth()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Failed to log out:", error)
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-g-nav/60 backdrop-blur-md border-b border-[var(--g-card-hover-border)]"
          : "bg-transparent backdrop-blur-sm"
      }`}
    >
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Logo />

        <div className="hidden md:flex space-x-6">
          <Link href="/about" className="text-g-muted hover:text-g-accent transition-colors">About</Link>
          <Link href="/profile-setup" className="text-g-muted hover:text-g-accent transition-colors">Profile</Link>
          <Link href="/companions" className="text-g-muted hover:text-g-accent transition-colors">Companions</Link>
        </div>

        <div className="hidden md:flex space-x-2 items-center">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-md text-g-muted hover:text-g-accent transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
          {currentUser ? (
            <Link
              href="/profile"
              className="flex items-center space-x-2 text-g-muted hover:text-g-accent transition-colors p-2 rounded-md hover:bg-g-page/20"
            >
              <User size={18} />
              <span className="text-sm">{currentUser.user_metadata?.full_name || currentUser.email}</span>
            </Link>
          ) : (
            <>
              <Button variant="ghost" className="text-g-muted hover:text-g-accent hover:bg-g-page/20" asChild>
                <Link href="/sign-in">Log In</Link>
              </Button>
              <Button className="bg-g-accent text-g-accent-text hover:bg-g-accent-hover" asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-md text-g-muted hover:text-g-accent transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
          <button className="text-g-text" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-g-nav/90 backdrop-blur-md">
          <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
            <Link href="/about" className="text-g-muted hover:text-g-accent transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
            <Link href="/profile-setup" className="text-g-muted hover:text-g-accent transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
            <Link href="/companions" className="text-g-muted hover:text-g-accent transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>Companions</Link>
            <div className="flex flex-col space-y-2 pt-2">
              {currentUser ? (
                <Link href="/profile" className="flex items-center space-x-2 text-g-muted hover:text-g-accent transition-colors py-2 px-2 rounded-md hover:bg-g-surface" onClick={() => setIsMobileMenuOpen(false)}>
                  <User size={18} />
                  <span className="text-sm">{currentUser.user_metadata?.full_name || currentUser.email}</span>
                </Link>
              ) : (
                <>
                  <Button variant="ghost" className="text-g-muted hover:text-g-accent justify-start" asChild onClick={() => setIsMobileMenuOpen(false)}>
                    <Link href="/sign-in">Log In</Link>
                  </Button>
                  <Button className="bg-g-accent text-g-accent-text hover:bg-g-accent-hover" asChild onClick={() => setIsMobileMenuOpen(false)}>
                    <Link href="/sign-up">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export function Navbar() {
  return (
    <Suspense fallback={<header className="fixed top-0 left-0 right-0 z-50 h-16" />}>
      <NavbarContent />
    </Suspense>
  )
}
