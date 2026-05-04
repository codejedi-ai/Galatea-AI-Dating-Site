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
      <div className="min-h-screen bg-black text-white">
        <Navbar />

        <main className="container mx-auto px-6 pt-24 pb-16">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-800 mx-auto mb-4 flex items-center justify-center">
                {currentUser?.user_metadata?.avatar_url ? (
                  <Image
                    src={currentUser.user_metadata.avatar_url}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                ) : (
                  <UserIcon className="h-12 w-12 text-gray-400" />
                )}
              </div>
              <h1 className="text-3xl font-bold">Profile Settings</h1>
              <p className="text-gray-400 mt-2">{currentUser?.email}</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-md mb-6 flex items-center gap-2">
                <AlertCircleIcon size={20} />
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-md mb-6 flex items-center gap-2">
                <CheckCircleIcon size={20} />
                <span>{successMessage}</span>
              </div>
            )}

            <div className="flex space-x-1 mb-8 bg-gray-900 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "profile"
                    ? "bg-teal-500 text-black"
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
              >
                <UserIcon className="inline-block w-4 h-4 mr-2" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "security"
                    ? "bg-teal-500 text-black"
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
              >
                <KeyIcon className="inline-block w-4 h-4 mr-2" />
                Security
              </button>
            </div>

            <div className="grid gap-6">
              {activeTab === "profile" && (
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <UserIcon className="h-5 w-5" />
                      Profile Information
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Update your display name and email address.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="displayName" className="text-white">Display Name</Label>
                        <Input
                          id="displayName"
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="bg-gray-800 border-gray-700 focus:border-teal-500 text-white"
                          placeholder="Enter your display name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-gray-800 border-gray-700 focus:border-teal-500 text-white"
                          placeholder="Enter your email"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-teal-500 text-black hover:bg-teal-400"
                      >
                        {isLoading ? "Updating..." : "Update Profile"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {activeTab === "security" && (
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <KeyIcon className="h-5 w-5" />
                      Change Password
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Set a new password for your account.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdatePassword} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-white">New Password</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="bg-gray-800 border-gray-700 focus:border-teal-500 text-white pr-10"
                            placeholder="Enter new password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                          >
                            {showNewPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-white">Confirm New Password</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="bg-gray-800 border-gray-700 focus:border-teal-500 text-white pr-10"
                            placeholder="Confirm new password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                          >
                            {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                          </button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-teal-500 text-black hover:bg-teal-400"
                      >
                        {isLoading ? "Updating..." : "Update Password"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-gray-900 border-red-500/50">
                <CardHeader>
                  <CardTitle className="text-red-400">Danger Zone</CardTitle>
                  <CardDescription className="text-gray-400">
                    Actions that affect your account permanently.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-teal-400 hover:bg-black/20"
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
