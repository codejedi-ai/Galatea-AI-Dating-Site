"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export function LoadingScreen({
  message = "Sculpting your experience...",
  onComplete,
}: {
  message?: string
  onComplete?: () => void
}) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          if (onComplete) {
            setTimeout(onComplete, 500)
          }
          return 100
        }
        return prev + Math.random() * 3 + 1
      })
    }, 50)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div className="fixed inset-0 g-bg-loading flex flex-col items-center justify-center z-50">
      <div className="w-full max-w-md px-4 flex flex-col items-center">
        <CircleLoader />
        <GalateaAIBarLoader progress={progress} message={message} />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 g-bg-loading-shimmer animate-shimmer" />
    </div>
  )
}

export function SimpleCircleLoader() {
  return (
    <div className="fixed inset-0 g-bg-loading flex flex-col items-center justify-center z-50">
      <div className="w-full max-w-md px-4 flex flex-col items-center">
        <CircleLoader />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 g-bg-loading-shimmer animate-shimmer" />
    </div>
  )
}

export function MinimalLoader() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-10 h-10 rounded-full border-2 border-t-transparent g-border-loading-accent animate-spin" />
    </div>
  )
}

export function CircleLoader() {
  return (
    <div className="relative w-full h-40 flex items-center justify-center mb-8">
      <div className="absolute w-32 h-32 rounded-full border-4 border-t-transparent g-border-loading-accent animate-spin" />
      <div className="absolute w-24 h-24 rounded-full border-4 border-b-transparent g-border-loading-accent-2 animate-spin [animation-delay:500ms]" />
      <div className="absolute w-16 h-16 rounded-full border-4 border-l-transparent g-border-loading-accent animate-spin [animation-delay:1000ms]" />
    </div>
  )
}

function GalateaAIBarLoader({ progress, message }: { progress: number; message: string }) {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold g-text-heading mb-8 text-center">
        Galatea<span className="g-text-loading-accent">.AI</span>
      </h1>
      <div className="w-full h-2 g-bg-loading-track rounded-full mb-4 overflow-hidden">
        <div
          className="h-full g-bg-loading-bar rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <p className="g-text-loading-accent text-lg font-medium text-center">{progress < 100 ? message : "Ready"}</p>
    </div>
  )
}
