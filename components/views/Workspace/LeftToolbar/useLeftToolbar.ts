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
    setStrokes
  } = useWorkspace()

  const setTool = (tool: Tool) => {
    setActiveTool(tool)
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStrokeColor(e.target.value)
  }

  const clearCanvas = () => {
    if (window.confirm("Are you sure you want to clear all drawings?")) {
      setStrokes([])
    }
  }

  const downloadAsJpeg = () => {
    const svgElement = document.getElementById("sketchly-canvas") as any
    if (!svgElement) return

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const rect = svgElement.getBoundingClientRect()
    
    canvas.width = rect.width
    canvas.height = rect.height
    if (ctx) {
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    const svgData = new XMLSerializer().serializeToString(svgElement)
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    
    const img = new Image()
    img.onload = () => {
      ctx?.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)
      
      const jpegUrl = canvas.toDataURL("image/jpeg", 0.9)
      const link = document.createElement("a")
      link.href = jpegUrl
      link.download = `sketchly-${Date.now()}.jpg`
      link.click()
    }
    img.src = url
  }

  return {
    activeTool,
    setTool,
    strokeColor,
    handleColorChange,
    strokeWidth,
    setStrokeWidth,
    clearCanvas,
    downloadAsJpeg
  }
}
