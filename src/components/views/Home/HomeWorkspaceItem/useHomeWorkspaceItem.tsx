import axios from "axios"
import { useState } from "react"
import { useHomeContext } from "../../../../contexts/HomeContext"
import { toast } from "@heroui/react"

const useHomeWorkspaceItem = () => {
  const { setWorkspaces } = useHomeContext()

  const [isOpenModal, setIsOpenModal] = useState(false)
  const [kindModal, setKindModal] = useState<"rename" | "delete">("rename")

  const handleDeleteWorkspace = async (workspaceId: string) => {
    try {
      await axios.delete(`/api/workspaces/${workspaceId}`)
      setWorkspaces(prev => prev.filter(w => w.id !== workspaceId))
      toast.success("Workspace deleted successfully!")
    } catch (error: any) {
      console.error(error)
      const status = error.response?.status || "Unknown"
      toast.danger(`Failed to delete workspace. (Error ${status})`)
    }
  }

  const handleRenameWorkspace = async (workspaceId: string, title: string) => {
    try {
      await axios.put(`/api/workspaces/${workspaceId}`, { title })
      setWorkspaces(prev =>
        prev.map(w => (w.id === workspaceId ? { ...w, title } : w))
      )
      toast.success("Workspace renamed successfully!")
    } catch (error: any) {
      console.error(error)
      const status = error.response?.status || "Unknown"
      toast.danger(`Failed to rename workspace. (Error ${status})`)
    }
  }

  return {
    handleDeleteWorkspace,
    handleRenameWorkspace,
    isOpenModal,
    setIsOpenModal,
    kindModal,
    setKindModal,
  }
}

export default useHomeWorkspaceItem
