import { useRouter } from "next/navigation"
import axios from "axios"

const useHomeActionBlank = () => {
  const router = useRouter()

  const handleCreateWorkspace = async () => {
    try {
      const response = await axios.post("/api/workspaces")
      console.log(response.data)
      const workspaceId = response.data.id
      router.push(`/workspace/${workspaceId}`)
    } catch (error) {
      console.error(error)
    }
  }
  return { handleCreateWorkspace }
}

export default useHomeActionBlank
