import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "@heroui/react"

const useHomeActionBlank = () => {
  const router = useRouter()

  const handleCreateWorkspace = async () => {
    try {
      const response = await axios.post("/api/workspaces")
      const workspaceId = response.data.id
      toast.success("Workspace created successfully!")
      router.push(`/workspace/${workspaceId}`)
    } catch (error: any) {
      console.error(error)
      const status = error.response?.status || "Unknown"
      toast.danger(`Failed to create workspace. (Error ${status})`)
    }
  }
  return { handleCreateWorkspace }
}

export default useHomeActionBlank
