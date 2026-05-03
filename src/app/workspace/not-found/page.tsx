"use client"

import { Button } from "@heroui/react"
import { LuArrowLeft, LuFolderX } from "react-icons/lu"
import Link from "next/link"
import HomeLayout from "@/components/layouts/HomeLayout"

export default function WorkspaceNotFound() {
  return (
    <HomeLayout>
      <div className="flex flex-col items-center justify-center flex-1 bg-background text-foreground animate-in fade-in duration-500">
        <div className="bg-default-100 p-6 rounded-full mb-6 relative">
          <LuFolderX className="w-16 h-16 text-default-500" strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Workspace Not Found
        </h1>
        <p className="text-default-500 mb-8 max-w-md text-center text-base">
          The workspace you are trying to access doesn&apos;t exist, you might
          not have permission, or it has been deleted.
        </p>
        <div className="flex space-x-4">
          <Link href="/">
            <Button className="font-medium">
              <LuArrowLeft className="w-5 h-5" />
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </HomeLayout>
  )
}
