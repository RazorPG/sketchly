import { useWorkspace, Tool } from "../../../../contexts/WorkspaceContext"
import React from "react"

export default function useLeftToolbar() {
  const {
    activeTool,
    setActiveTool,
    strokeColor,
    setStrokeColor,
    strokeWidth,
    setStrokeWidth,
  } = useWorkspace()

  const setTool = (tool: Tool) => {
    setActiveTool(tool)
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStrokeColor(e.target.value)
  }

  return {
    activeTool,
    setTool,
    strokeColor,
    handleColorChange,
    strokeWidth,
    setStrokeWidth,
  }
}
