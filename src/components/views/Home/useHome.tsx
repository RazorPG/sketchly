"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { useHomeContext } from "../../../contexts/HomeContext"

function useHome() {
  const { workspaces, setWorkspaces } = useHomeContext()
  const [isLoading, setIsLoading] = useState(false)

  const fetchWorkspaces = async () => {
    setIsLoading(true)
    const res = await axios.get("/api/workspaces")
    setWorkspaces(res.data)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchWorkspaces()
  }, [])

  return { workspaces, isLoading }
}

export default useHome
