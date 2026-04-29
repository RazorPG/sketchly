"use client"

import useCanvas from "./useCanvas"
import { useWorkspace } from "../../../../contexts/WorkspaceContext"

export default function Canvas() {
  const {
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
  } = useCanvas()

  const { strokeColor, strokeWidth } = useWorkspace()

  // Custom SVG cursor to prevent Chromium bug where native crosshair turns white after pointer capture
  const CUSTOM_PEN_CURSOR = `url("/images/crosshair.svg") 12 12, crosshair`

  let cursorClass = "cursor-default"
  let cursorStyle: React.CSSProperties | undefined = undefined

  if (activeTool === "pen") {
    cursorStyle = { cursor: CUSTOM_PEN_CURSOR }
  } else if (activeTool === "eraser") {
    cursorClass = "cursor-cell"
  } else if (activeTool === "hand") {
    // Custom SVGs avoid Chromium native grab inversion bugs
    cursorClass = "cursor-[url('/images/grab.svg')_12_12,_grab] active:cursor-[url('/images/grabbing.svg')_12_12,_grabbing]"
  }

  return (
    <div 
      className={`w-[1024px] h-[768px] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] rounded-lg transition-all shrink-0 select-none touch-none ${cursorClass}`}
      style={cursorStyle}
    >
      <svg
        className="w-full h-full rounded-lg touch-none"
        onPointerDown={startInteraction}
        onPointerMove={draw}
        onPointerUp={stopInteraction}
        onPointerLeave={handlePointerLeave}
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
            onPointerDown={(e) => handleStrokePointerDown(e, stroke.id)}
            onPointerEnter={(e) => handleStrokePointerEnter(e, stroke.id)}
            className={activeTool === "eraser" ? "hover:stroke-red-500 hover:stroke-[8px] transition-all duration-150 cursor-pointer" : ""}
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
  )
}
