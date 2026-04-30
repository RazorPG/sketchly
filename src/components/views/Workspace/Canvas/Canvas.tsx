"use client"

import { useEffect } from "react"
import useCanvas from "./useCanvas"
import { useWorkspaceContext } from "../../../../contexts/WorkspaceContext"

export default function Canvas() {
  const {
    strokes,
    currentPoints,
    startInteraction,
    draw,
    stopInteraction,
    handleStrokePointerDown,
    handleStrokePointerEnter,
    getSvgPathFromPoints,
    activeTool,
  } = useCanvas()

  const { strokeColor, strokeWidth, zoom, setZoom } = useWorkspaceContext()

  useEffect(() => {
    const container = document.getElementById("canvas-container")
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault()
        if (e.deltaY < 0) {
          setZoom(prev => Math.min(prev + 0.1, 3))
        } else {
          setZoom(prev => Math.max(prev - 0.1, 0.1))
        }
      }
    }

    container.addEventListener("wheel", handleWheel, { passive: false })
    return () => container.removeEventListener("wheel", handleWheel)
  }, [setZoom])

  const CUSTOM_PEN_CURSOR = `url("/images/crosshair.svg") 12 12, crosshair`
  const CUSTOM_HAND_CURSOR = `cursor-[url('/images/grab.svg')_12_12,_grab] active:cursor-[url('/images/grabbing.svg')_12_12,_grabbing]`
  const CUSTOM_ERASER_CURSOR = `url("/images/eraser.svg") 4 20, cell`

  let cursorClass = "cursor-default"
  let cursorStyle: React.CSSProperties | undefined = undefined

  if (activeTool === "pen") {
    cursorStyle = { cursor: CUSTOM_PEN_CURSOR }
  } else if (activeTool === "eraser") {
    cursorStyle = { cursor: CUSTOM_ERASER_CURSOR }
  } else if (activeTool === "hand") {
    cursorClass = CUSTOM_HAND_CURSOR
  }

  return (
    <div
      className="relative shrink-0 select-none touch-none"
      style={{ width: 1024 * zoom, height: 768 * zoom }}
    >
      <div
        className={`absolute top-0 left-0 w-5xl h-192 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] rounded-lg transition-transform origin-top-left ${cursorClass}`}
        style={{ ...cursorStyle, transform: `scale(${zoom})` }}
      >
        <svg
          id="sketchly-canvas"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full rounded-lg touch-none bg-white"
          onPointerDown={startInteraction}
          onPointerMove={draw}
          onPointerUp={stopInteraction}
          onPointerCancel={stopInteraction}
        >
          {/* Render saved strokes */}
          {strokes.map(stroke => (
            <path
              key={stroke.id}
              d={getSvgPathFromPoints(stroke.points)}
              stroke={stroke.color}
              strokeWidth={stroke.width}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              onPointerDown={e => handleStrokePointerDown(e, stroke.id)}
              onPointerEnter={e => handleStrokePointerEnter(e, stroke.id)}
              className={
                activeTool === "eraser"
                  ? "hover:stroke-red-500 hover:drop-shadow-[0_0_6px_rgba(255,0,0,0.7)] transition-all duration-150"
                  : ""
              }
            />
          ))}

          {/* Render currently drawing stroke */}
          {currentPoints.length > 0 && (
            <path
              d={getSvgPathFromPoints(currentPoints)}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      </div>
    </div>
  )
}
