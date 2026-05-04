"use client"

import { Suspense, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, X } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { LoadingScreen } from "@/components/loading-screen"

interface AIProfile {
  uuid: string
  id: number
  name: string
  age: number
  bio: string
  imageUrl: string
}

interface SwipeDecision {
  [uuid: string]: "accepted" | "rejected"
}

function StartSwipingContent() {
  const [profiles, setProfiles] = useState<AIProfile[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [decisions, setDecisions] = useState<SwipeDecision>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null)

  const searchParams = useSearchParams()

  useEffect(() => {
    const profilesParam = searchParams.get("profiles")
    if (profilesParam) {
      try {
        const parsedProfiles = JSON.parse(decodeURIComponent(profilesParam)) as AIProfile[]
        setProfiles(parsedProfiles)
        setIsLoading(false)
      } catch (err) {
        setError("Failed to parse profiles. Please try again.")
        setIsLoading(false)
      }
    } else {
      initiateSwipe()
    }
  }, [searchParams])

  async function initiateSwipe() {
    try {
      const response = await fetch("/api/init-swiping")
      if (!response.ok) {
        throw new Error("Failed to initiate swipe session")
      }
      const data = await response.json()
      setProfiles(data)
      setIsLoading(false)
    } catch (err) {
      setError("Failed to start swiping session. Please try again later.")
      setIsLoading(false)
    }
  }

  const handleDecision = (decision: "accepted" | "rejected") => {
    if (currentIndex >= profiles.length) return

    const currentProfile = profiles[currentIndex]
    setDecisions((prev) => ({ ...prev, [currentProfile.uuid]: decision }))

    setSwipeDirection(decision === "accepted" ? "right" : "left")

    setTimeout(() => {
      setSwipeDirection(null)
      if (currentIndex < profiles.length - 1) {
        setCurrentIndex((prev) => prev + 1)
      } else {
        submitDecisions()
      }
    }, 300)
  }

  const submitDecisions = async () => {
    try {
      const response = await fetch("/api/submit-decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(decisions),
      })
      if (!response.ok) throw new Error("Failed to submit decisions")
    } catch (err) {
      setError("Failed to submit decisions. Please try again.")
    }
  }

  if (isLoading) {
    return <LoadingScreen message="Loading your matches..." />
  }

  if (error) {
    return (
      <div className="min-h-screen g-bg-page flex flex-col items-center justify-center g-text-danger">
        <p className="mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} className="g-bg-accent g-text-accent-text hover:g-bg-accent-hover">
          Try Again
        </Button>
      </div>
    )
  }

  if (profiles.length === 0) {
    return (
      <div className="min-h-screen g-bg-page flex flex-col items-center justify-center g-text-primary">
        <p className="mb-4">No profiles available</p>
        <Button asChild className="g-bg-accent g-text-accent-text hover:g-bg-accent-hover">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    )
  }

  if (currentIndex >= profiles.length) {
    return (
      <div className="min-h-screen g-bg-page flex flex-col items-center justify-center g-text-primary">
        <h2 className="text-3xl font-bold mb-4">Swiping complete!</h2>
        <p className="g-text-muted mb-8">We're analyzing your preferences to create your perfect AI companion.</p>
        <Button asChild className="g-bg-accent g-text-accent-text hover:g-bg-accent-hover">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    )
  }

  const currentProfile = profiles[currentIndex]

  return (
    <div className="min-h-screen g-bg-page g-text-primary">
      <Navbar />

      <main className="container mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold text-center mb-12">
          Find Your <span className="g-text-accent">Perfect Match</span>
        </h1>

        <div className="flex justify-center">
          <Card
            className={`w-full max-w-md g-bg-card border g-border-card overflow-hidden transition-transform duration-300 ${
              swipeDirection === "left"
                ? "translate-x-[-100vw]"
                : swipeDirection === "right"
                  ? "translate-x-[100vw]"
                  : ""
            }`}
          >
            <CardContent className="p-0">
              <div className="relative aspect-[3/4]">
                <Image
                  src={currentProfile.imageUrl || "/placeholder.svg"}
                  alt={currentProfile.name}
                  fill
                  style={{ objectFit: "cover" }}
                />
                <div className="absolute inset-0 g-card-overlay"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h2 className="text-3xl font-bold text-white drop-shadow-lg">
                    {currentProfile.name}, {currentProfile.age}
                  </h2>
                  <p className="text-white/80 mt-2 drop-shadow">{currentProfile.bio}</p>
                </div>
              </div>

              <div className="flex justify-center space-x-8 p-6">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full p-4 g-border-danger g-text-danger hover:g-bg-danger-tint hover:g-text-danger-hover"
                  onClick={() => handleDecision("rejected")}
                >
                  <X className="h-8 w-8" />
                  <span className="sr-only">Reject</span>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full p-4 g-border-accent g-text-accent hover:g-bg-accent-tint"
                  onClick={() => handleDecision("accepted")}
                >
                  <Heart className="h-8 w-8" />
                  <span className="sr-only">Accept</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center g-text-muted">
          <p>
            Profile {currentIndex + 1} of {profiles.length}
          </p>
        </div>
      </main>

      <footer className="g-bg-page border-t g-border-color mt-auto">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center g-text-muted">© 2024 Galatea.AI. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}

export default function StartSwiping() {
  return (
    <Suspense fallback={<LoadingScreen message="Loading your matches..." />}>
      <StartSwipingContent />
    </Suspense>
  )
}
