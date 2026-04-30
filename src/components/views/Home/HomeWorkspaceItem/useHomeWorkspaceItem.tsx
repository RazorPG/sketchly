import axios from "axios"
import { useState } from "react"
import { useHomeContext } from "../../../../contexts/HomeContext"

const useHomeWorkspaceItem = () => {
  const { setWorkspaces } = useHomeContext()

  const [isOpenModal, setIsOpenModal] = useState(false)
  const [kindModal, setKindModal] = useState<"rename" | "delete">("rename")

  const handleDeleteWorkspace = async (workspaceId: string) => {
    try {
      await axios.delete(`/api/workspaces/${workspaceId}`)
      setWorkspaces(prev => prev.filter(w => w.id !== workspaceId))
    } catch (error) {
      console.error(error)
    }
  }

  const handleRenameWorkspace = async (workspaceId: string, title: string) => {
    try {
      await axios.put(`/api/workspaces/${workspaceId}`, { title })
      setWorkspaces(prev =>
        prev.map(w => (w.id === workspaceId ? { ...w, title } : w))
      )
    } catch (error) {
      console.error(error)
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
