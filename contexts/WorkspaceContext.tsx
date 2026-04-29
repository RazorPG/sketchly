"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export type Tool = "pen" | "eraser" | "hand"

interface WorkspaceContextType {
  activeTool: Tool
  setActiveTool: (tool: Tool) => void
  strokeColor: string
  setStrokeColor: (color: string) => void
  strokeWidth: number
  setStrokeWidth: (width: number) => void
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined)

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [activeTool, setActiveTool] = useState<Tool>("pen")
  const [strokeColor, setStrokeColor] = useState<string>("#000000")
  const [strokeWidth, setStrokeWidth] = useState<number>(4)

  return (
    <WorkspaceContext.Provider value={{ 
      activeTool, setActiveTool,
      strokeColor, setStrokeColor,
      strokeWidth, setStrokeWidth
    }}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider")
  }
  return context
}
