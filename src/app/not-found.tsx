"use client"

import { Button } from "@heroui/react"
import { LuArrowLeft, LuFrown } from "react-icons/lu"
import Link from "next/link"
import HomeLayout from "@/components/layouts/HomeLayout"
import { useAuth } from "@clerk/nextjs"

export default function NotFound() {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f3f2ef]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Optional: Redirect or just show the 404 for unauthenticated users instead of the layout
  if (!isSignedIn) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f3f2ef]">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Page Not Found</h1>
          <p className="text-default-500 mb-8 max-w-md text-lg">Please sign in to access your workspaces.</p>
          <Link href="/">
            <Button className="font-medium bg-black text-white">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <HomeLayout>
      <div className="flex flex-col items-center justify-center flex-1 bg-background text-foreground animate-in fade-in zoom-in duration-500">
        <LuFrown className="w-24 h-24 text-default-400 mb-8" strokeWidth={1} />
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Page Not Found
        </h1>
        <p className="text-default-500 mb-8 max-w-md text-center text-lg">
          The page you are trying to access doesn&apos;t exist or has been
          moved.
        </p>
        <Link href="/">
          <Button className="font-medium">
            <LuArrowLeft className="w-5 h-5" />
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </HomeLayout>
  )
}
