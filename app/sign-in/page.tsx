"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Navbar } from "@/components/navbar";
import { Eye as EyeIcon, EyeOff as EyeOffIcon, CircleCheck as CheckCircleIcon } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { SimpleCircleLoader } from "@/components/loading-screen";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const { login, loginWithGoogle, loginWithFacebook } = useAuth();
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);
    setShowLoadingScreen(true);

    try {
      await login(email, password);
      setSuccessMessage("Successfully signed in! Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Invalid email or password. Please try again.");
      setShowLoadingScreen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    setError("");
    setSuccessMessage("");
    setShowLoadingScreen(true);

    try {
      if (provider === "google") {
        await loginWithGoogle();
      } else {
        await loginWithFacebook();
      }
      setSuccessMessage("Successfully signed in! Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err: any) {
      setError(err.message || `Failed to sign in with ${provider}`);
      setShowLoadingScreen(false);
    }
  };

  return (
    <div className="min-h-screen g-bg-page g-text-primary">
      {showLoadingScreen && <SimpleCircleLoader />}
      {!showLoadingScreen && <Navbar />}

      <main className="container mx-auto px-6 pt-24 pb-16 flex justify-center">
        <div className="w-full max-w-md">
          {!showLoadingScreen && (
            <div className="text-center mb-8">
              <Image
                src="/favicon.png"
                alt="Galatea.AI Logo"
                width={80}
                height={80}
                className="mx-auto filter brightness-0 dark:invert mb-4"
              />
              <h1 className="text-3xl font-bold">
                Welcome to <span className="g-text-accent">Galatea.AI</span>
              </h1>
              <p className="g-text-muted mt-2">
                Sign in to continue your journey
              </p>
            </div>
          )}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-600 dark:text-green-400 px-4 py-3 rounded-md mb-6 flex items-center gap-2">
              <CheckCircleIcon size={20} />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="g-text-primary">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="g-input-bg g-input-border g-text-primary"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="g-text-primary">Password</Label>
                <Link href="/forgot-password" className="text-sm g-text-accent hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="g-input-bg g-input-border g-text-primary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 g-text-subtle hover:g-text-primary"
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="g-input-border data-[state=checked]:bg-[var(--g-accent)]"
              />
              <Label htmlFor="remember" className="text-sm g-text-muted">
                Remember me for 30 days
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full g-bg-accent g-text-accent-text hover:g-bg-accent-hover py-6"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t g-border-color"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 g-bg-page g-text-muted">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialLogin("google")}
                className="g-border-card g-bg-card hover:g-border-accent g-text-muted hover:g-text-primary transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialLogin("facebook")}
                className="g-border-card g-bg-card hover:g-border-accent g-text-muted hover:g-text-primary transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
                Facebook
              </Button>
            </div>

            <div className="text-center mt-6">
              <p className="g-text-muted">
                Don&apos;t have an account?{" "}
                <Link href="/sign-up" className="g-text-accent hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </main>

      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[var(--g-surface-alt)] to-transparent -z-10"></div>
    </div>
  );
}
