"use client"

import type { Workspace } from "@prisma/client"
import axios from "axios"
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react"

interface HomeContextValue {
  workspaces: Workspace[]
  setWorkspaces: Dispatch<SetStateAction<Workspace[]>>
  isLoading: boolean
}

const HomeContext = createContext<HomeContextValue | null>(null)

export function HomeProvider({ children }: { children: ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchWorkspaces = async () => {
      setIsLoading(true)
      const res = await axios.get("/api/workspaces")
      setWorkspaces(res.data)
      setIsLoading(false)
    }
    fetchWorkspaces()
  }, [])

  return (
    <HomeContext.Provider value={{ workspaces, setWorkspaces, isLoading }}>
      {children}
    </HomeContext.Provider>
  )
}

export function useHomeContext() {
  const context = useContext(HomeContext)
  if (!context) {
    throw new Error("useHomeContext must be used within a HomeProvider")
  }
  return context
}
