"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/contexts/auth-context";
import supabase from "@/lib/supabase/client";
import { LogOut } from "lucide-react";
import { CircleCheck as CheckCircleIcon, User as UserIcon, Key as KeyIcon, CircleAlert as AlertCircleIcon, Eye as EyeIcon, EyeOff as EyeOffIcon } from "lucide-react";

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || "");
      setEmail(currentUser.email || "");
    }
  }, [currentUser]);

  const showMessage = (message: string, isError = false) => {
    if (isError) {
      setError(message);
      setSuccessMessage("");
    } else {
      setSuccessMessage(message);
      setError("");
    }
    setTimeout(() => {
      setError("");
      setSuccessMessage("");
    }, 5000);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsLoading(true);
    try {
      const updates: { data?: { full_name: string }; email?: string } = {
        data: { full_name: displayName },
      };
      if (email !== currentUser.email) {
        updates.email = email;
      }
      const { error: updateError } = await supabase.auth.updateUser(updates);
      if (updateError) throw updateError;
      showMessage("Profile updated successfully!");
    } catch (err: any) {
      showMessage(err.message || "Failed to update profile", true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showMessage("Passwords do not match", true);
      return;
    }
    if (newPassword.length < 6) {
      showMessage("Password must be at least 6 characters", true);
      return;
    }

    setIsLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) throw updateError;
      setNewPassword("");
      setConfirmPassword("");
      showMessage("Password updated successfully!");
    } catch (err: any) {
      showMessage(err.message || "Failed to update password", true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (err: any) {
      showMessage(err.message || "Failed to log out", true);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen g-bg-page g-text-primary">
        <Navbar />

        <main className="container mx-auto px-6 pt-24 pb-16">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="h-24 w-24 rounded-full overflow-hidden g-bg-card mx-auto mb-4 flex items-center justify-center border g-border-card">
                {currentUser?.user_metadata?.avatar_url ? (
                  <Image
                    src={currentUser.user_metadata.avatar_url}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                ) : (
                  <UserIcon className="h-12 w-12 g-text-subtle" />
                )}
              </div>
              <h1 className="text-3xl font-bold g-text-primary">Profile Settings</h1>
              <p className="g-text-muted mt-2">{currentUser?.email}</p>
            </div>

            {error && (
              <div className="g-bg-error border g-border-error g-text-error px-4 py-3 rounded-md mb-6 flex items-center gap-2">
                <AlertCircleIcon size={20} />
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="g-bg-success border g-border-success g-text-success px-4 py-3 rounded-md mb-6 flex items-center gap-2">
                <CheckCircleIcon size={20} />
                <span>{successMessage}</span>
              </div>
            )}

            <div className="flex space-x-1 mb-8 g-bg-card p-1 rounded-lg border g-border-card">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "profile"
                    ? "g-bg-accent g-text-accent-text"
                    : "g-text-muted hover:g-text-primary hover:g-bg-surface"
                }`}
              >
                <UserIcon className="inline-block w-4 h-4 mr-2" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "security"
                    ? "g-bg-accent g-text-accent-text"
                    : "g-text-muted hover:g-text-primary hover:g-bg-surface"
                }`}
              >
                <KeyIcon className="inline-block w-4 h-4 mr-2" />
                Security
              </button>
            </div>

            <div className="grid gap-6">
              {activeTab === "profile" && (
                <Card className="g-bg-card border g-border-card">
                  <CardHeader>
                    <CardTitle className="g-text-primary flex items-center gap-2">
                      <UserIcon className="h-5 w-5" />
                      Profile Information
                    </CardTitle>
                    <CardDescription className="g-text-muted">
                      Update your display name and email address.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="displayName" className="g-text-primary">Display Name</Label>
                        <Input
                          id="displayName"
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="g-input-bg g-input-border g-text-primary"
                          placeholder="Enter your display name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="g-text-primary">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="g-input-bg g-input-border g-text-primary"
                          placeholder="Enter your email"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="g-bg-accent g-text-accent-text hover:g-bg-accent-hover"
                      >
                        {isLoading ? "Updating..." : "Update Profile"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {activeTab === "security" && (
                <Card className="g-bg-card border g-border-card">
                  <CardHeader>
                    <CardTitle className="g-text-primary flex items-center gap-2">
                      <KeyIcon className="h-5 w-5" />
                      Change Password
                    </CardTitle>
                    <CardDescription className="g-text-muted">
                      Set a new password for your account.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdatePassword} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="g-text-primary">New Password</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="g-input-bg g-input-border g-text-primary pr-10"
                            placeholder="Enter new password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 g-text-subtle hover:g-text-primary"
                          >
                            {showNewPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="g-text-primary">Confirm New Password</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="g-input-bg g-input-border g-text-primary pr-10"
                            placeholder="Confirm new password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 g-text-subtle hover:g-text-primary"
                          >
                            {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                          </button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="g-bg-accent g-text-accent-text hover:g-bg-accent-hover"
                      >
                        {isLoading ? "Updating..." : "Update Password"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              <Card className="g-bg-card border g-border-danger-faded">
                <CardHeader>
                  <CardTitle className="g-text-danger">Danger Zone</CardTitle>
                  <CardDescription className="g-text-muted">
                    Actions that affect your account permanently.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="g-text-muted hover:g-text-accent hover:bg-transparent"
                  >
                    <LogOut size={18} className="mr-2" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
