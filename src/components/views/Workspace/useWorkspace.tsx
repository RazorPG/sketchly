"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { useWorkspaceContext } from "@/contexts/WorkspaceContext"
import { useAuth } from "@clerk/nextjs"

export function useWorkspace() {
  const params = useParams()
  const router = useRouter()
  const { isLoaded, isSignedIn } = useAuth()
  const { setHistoryState, setStrokes } = useWorkspaceContext()
  const [isLoading, setIsLoading] = useState(true)
  const hasFetched = useRef(false)

  useEffect(() => {
    // Wait until Clerk auth status is loaded
    if (!isLoaded) return

    // If no session (not logged in), disable loading so user can draw (without saving)
    if (!isSignedIn) {
      setIsLoading(false)
      return
    }

    const id = params?.id
    if (!id) {
      setIsLoading(false)
      return
    }

    if (hasFetched.current) return

    const fetchWorkspace = async () => {
      try {
        hasFetched.current = true
        setIsLoading(true)
        const response = await axios.get(`/api/workspaces/${id}`)
        const workspace = response.data

        // If history object exists, then load it
        if (workspace.history && workspace.history.present) {
          setHistoryState(workspace.history)
        } else if (workspace.strokes && Array.isArray(workspace.strokes)) {
          // Fallback if only strokes are saved
          setStrokes(workspace.strokes)
        }
      } catch (error: any) {
        console.error("Failed to fetch workspace:", error)
        if (error.response?.status === 404) {
          router.push("/workspace/not-found")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorkspace()
  }, [isLoaded, isSignedIn, params?.id])

  return { isLoading }
}
