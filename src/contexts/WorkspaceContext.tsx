"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export type Tool = "pen" | "eraser" | "hand"
export type Point = { x: number; y: number }
export type Stroke = {
  id: string
  points: Point[]
  color: string
  width: number
}

type HistoryState = {
  past: Stroke[][]
  present: Stroke[]
  future: Stroke[][]
}

interface WorkspaceContextType {
  activeTool: Tool
  setActiveTool: (tool: Tool) => void
  strokeColor: string
  setStrokeColor: (color: string) => void
  strokeWidth: number
  setStrokeWidth: (width: number) => void
  strokes: Stroke[]
  setStrokes: React.Dispatch<React.SetStateAction<Stroke[]>>
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  clearHistory: () => void
  zoom: number
  setZoom: React.Dispatch<React.SetStateAction<number>>
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
)

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [activeTool, setActiveTool] = useState<Tool>("pen")
  const [strokeColor, setStrokeColor] = useState<string>("#000000")
  const [strokeWidth, setStrokeWidth] = useState<number>(4)
  const [zoom, setZoom] = useState<number>(1)
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: [],
    future: [],
  })

  const handleSetStrokes: React.Dispatch<
    React.SetStateAction<Stroke[]>
  > = action => {
    setHistory(current => {
      const nextStrokes =
        typeof action === "function" ? (action as any)(current.present) : action
      if (nextStrokes === current.present) return current
      return {
        past: [...current.past, current.present],
        present: nextStrokes,
        future: [],
      }
    })
  }

  const undo = () => {
    setHistory(current => {
      if (current.past.length === 0) return current
      const previous = current.past[current.past.length - 1]
      const newPast = current.past.slice(0, current.past.length - 1)
      return {
        past: newPast,
        present: previous,
        future: [current.present, ...current.future],
      }
    })
  }

  const redo = () => {
    setHistory(current => {
      if (current.future.length === 0) return current
      const next = current.future[0]
      const newFuture = current.future.slice(1)
      return {
        past: [...current.past, current.present],
        present: next,
        future: newFuture,
      }
    })
  }

  const clearHistory = () => {
    setHistory({
      past: [],
      present: [],
      future: [],
    })
  }

  return (
    <WorkspaceContext.Provider
      value={{
        activeTool,
        setActiveTool,
        strokeColor,
        setStrokeColor,
        strokeWidth,
        setStrokeWidth,
        strokes: history.present,
        setStrokes: handleSetStrokes,
        undo,
        redo,
        canUndo: history.past.length > 0,
        canRedo: history.future.length > 0,
        clearHistory,
        zoom,
        setZoom,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspaceContext() {
  const context = useContext(WorkspaceContext)
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider")
  }
  return context
}
