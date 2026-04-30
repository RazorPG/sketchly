"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import { useWorkspaceContext } from "@/contexts/WorkspaceContext"

export function useWorkspace() {
  const params = useParams()
  const { setHistoryState, setStrokes } = useWorkspaceContext()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const id = params?.id
    if (!id) return

    const fetchWorkspace = async () => {
      try {
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
      } catch (error) {
        console.error("Failed to fetch workspace:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorkspace()
  }, [params?.id])

  return { isLoading }
}
