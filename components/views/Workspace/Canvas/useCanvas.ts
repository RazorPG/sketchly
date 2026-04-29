import { useState, useRef, PointerEvent } from "react"
import { useWorkspace } from "../../../../contexts/WorkspaceContext"

export type Point = { x: number; y: number }
export type Stroke = { id: string; points: Point[]; color: string; width: number }

export default function useCanvas() {
  const { activeTool, strokeColor, strokeWidth } = useWorkspace()
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [currentPoints, setCurrentPoints] = useState<Point[]>([])
  const isDrawing = useRef(false)
  const isErasing = useRef(false)
  const isPanning = useRef(false)
  const lastPanPoint = useRef({ x: 0, y: 0 })

  const getCoordinates = (e: PointerEvent<SVGSVGElement>): Point => {
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  const startInteraction = (e: PointerEvent<SVGSVGElement>) => {
    if (activeTool === "pen") {
      e.currentTarget.setPointerCapture(e.pointerId)
      isDrawing.current = true
      const startPoint = getCoordinates(e)
      setCurrentPoints([startPoint])
    } else if (activeTool === "eraser") {
      isErasing.current = true
    } else if (activeTool === "hand") {
      e.currentTarget.setPointerCapture(e.pointerId)
      isPanning.current = true
      lastPanPoint.current = { x: e.clientX, y: e.clientY }
    }
  }

  const draw = (e: PointerEvent<SVGSVGElement>) => {
    if (activeTool === "pen" && isDrawing.current) {
      const newPoint = getCoordinates(e)
      setCurrentPoints(prev => [...prev, newPoint])
    } else if (activeTool === "hand" && isPanning.current) {
      const container = e.currentTarget.closest(".overflow-auto")
      if (container) {
        const dx = e.clientX - lastPanPoint.current.x
        const dy = e.clientY - lastPanPoint.current.y
        container.scrollLeft -= dx
        container.scrollTop -= dy
        lastPanPoint.current = { x: e.clientX, y: e.clientY }
      }
    }
  }

  const stopInteraction = (e: PointerEvent<SVGSVGElement>) => {
    if (activeTool === "pen" || activeTool === "hand") {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch (err) {}
    }
    if (isDrawing.current && activeTool === "pen") {
      isDrawing.current = false
      if (currentPoints.length > 0) {
        setStrokes(prev => [...prev, { 
          id: Date.now().toString(), 
          points: currentPoints,
          color: strokeColor,
          width: strokeWidth
        }])
        setCurrentPoints([])
      }
    }
    isErasing.current = false
    isPanning.current = false
  }

  const handlePointerLeave = () => {
    if (activeTool !== "pen") {
      isErasing.current = false
    }
  }

  const handleStrokePointerDown = (e: PointerEvent<SVGPathElement>, id: string) => {
    if (activeTool === "eraser") {
      setStrokes(prev => prev.filter(s => s.id !== id))
    }
  }

  const handleStrokePointerEnter = (e: PointerEvent<SVGPathElement>, id: string) => {
    if (activeTool === "eraser" && isErasing.current) {
      setStrokes(prev => prev.filter(s => s.id !== id))
    }
  }

  const getSvgPathFromPoints = (points: Point[]) => {
    if (points.length === 0) return ""
    const start = points[0]
    let path = `M ${start.x} ${start.y}`
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`
    }
    return path
  }

  return {
    strokes,
    currentPoints,
    startInteraction,
    draw,
    stopInteraction,
    handlePointerLeave,
    handleStrokePointerDown,
    handleStrokePointerEnter,
    getSvgPathFromPoints,
    activeTool
  }
}
