import axios from "axios"
import { useState, useRef, useEffect } from "react"
import { useHomeContext } from "../../../../contexts/HomeContext"
import { toast } from "@heroui/react"

const useHomeWorkspaceItem = (initialTitle: string, workspaceId: string) => {
  const { setWorkspaces } = useHomeContext()

  const [isOpenModal, setIsOpenModal] = useState(false)
  const [kindModal, setKindModal] = useState<"delete">("delete")

  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(initialTitle)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const submitRename = async () => {
    if (!isEditing) return
    setIsEditing(false)

    const newTitle = editTitle.trim()
    if (!newTitle || newTitle === initialTitle) {
      // Revert if empty or unchanged
      setEditTitle(initialTitle)
      return
    }

    try {
      await axios.put(`/api/workspaces/${workspaceId}`, { title: newTitle })
      setWorkspaces(prev =>
        prev.map(w => (w.id === workspaceId ? { ...w, title: newTitle } : w))
      )
      toast.success("Workspace renamed successfully!")
    } catch (error: any) {
      console.error(error)
      setEditTitle(initialTitle)
      const status = error.response?.status || "Unknown"
      toast.danger(`Failed to rename workspace. (Error ${status})`)
    }
  }

  const handleDeleteWorkspace = async () => {
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

  return {
    handleDeleteWorkspace,
    isOpenModal,
    setIsOpenModal,
    kindModal,
    setKindModal,
    isEditing,
    setIsEditing,
    editTitle,
    setEditTitle,
    inputRef,
    submitRename,
  }
}

export default useHomeWorkspaceItem
