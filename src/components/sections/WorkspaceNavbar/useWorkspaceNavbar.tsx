import axios from "axios"
import { useParams } from "next/navigation"
import { useWorkspaceContext } from "@/contexts/WorkspaceContext"

const useWorkspaceNavbar = () => {
  const params = useParams()
  const { strokes, history } = useWorkspaceContext()

  const workspaceId = Array.isArray(params?.id) ? params.id[0] : params?.id

  const handleSave = async () => {
    if (!workspaceId) return

    try {
      await axios.put(`/api/workspaces/${workspaceId}`, { strokes, history })
    } catch (error) {
      console.error(error)
    }
  }

  return { handleSave }
}

export default useWorkspaceNavbar
