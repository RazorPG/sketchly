import axios from "axios"
import { useParams } from "next/navigation"
import { useWorkspaceContext } from "@/contexts/WorkspaceContext"
import { useEffect, useState } from "react"
import { toast } from "@heroui/react"

const useWorkspaceNavbar = () => {
  const params = useParams()
  const { strokes, history } = useWorkspaceContext()
  const [title, setTitle] = useState<string>("Untitled Sketch")

  const workspaceId = Array.isArray(params?.id) ? params.id[0] : params?.id

  useEffect(() => {
    const fetchTitle = async () => {
      if (!workspaceId) return

      try {
        const response = await axios.get(`/api/workspaces/${workspaceId}`)
        setTitle(response.data.title)
      } catch (error) {
        console.error(error)
      }
    }

    fetchTitle()
  }, [workspaceId])

  const handleSave = async () => {
    if (!workspaceId) return

    try {
      await axios.put(`/api/workspaces/${workspaceId}`, { strokes, history })
      toast.success("Workspace saved successfully!")
    } catch (error) {
      console.error(error)
      toast.danger("Failed to save workspace.")
    }
  }

  return { handleSave, title }
}

export default useWorkspaceNavbar
