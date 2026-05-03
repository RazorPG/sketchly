"use client"

import { useHomeContext } from "../../../contexts/HomeContext"

function useHome() {
  const { workspaces, setWorkspaces, searchQuery, setSearchQuery, isLoading } =
    useHomeContext()

  return { workspaces, isLoading, searchQuery, setSearchQuery }
}

export default useHome
