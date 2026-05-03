"use client"

import type { Workspace } from "@prisma/client"
import axios from "axios"
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react"

interface HomeContextValue {
  workspaces: Workspace[]
  setWorkspaces: Dispatch<SetStateAction<Workspace[]>>
  searchQuery: string
  setSearchQuery: Dispatch<SetStateAction<string>>
  isLoading: boolean
}

const HomeContext = createContext<HomeContextValue | null>(null)

export function HomeProvider({ children }: { children: ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const isMounted = useRef(false)

  useEffect(() => {
    const fetchWorkspaces = async () => {
      setIsLoading(true)
      try {
        const res = await axios.get("/api/workspaces", {
          params: { search: searchQuery },
        })
        setWorkspaces(res.data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    if (!isMounted.current) {
      // Fetch immediately on initial mount
      fetchWorkspaces()
      isMounted.current = true
      return
    }

    // Apply 1.5s debounce for subsequent searches
    const timeoutId = setTimeout(() => {
      fetchWorkspaces()
    }, 1500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  return (
    <HomeContext.Provider
      value={{
        workspaces,
        setWorkspaces,
        searchQuery,
        setSearchQuery,
        isLoading,
      }}
    >
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
