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
    handleStrokePointerDown,
    handleStrokePointerEnter,
    getSvgPathFromPoints,
    activeTool,
  } = useCanvas()

  const { strokeColor, strokeWidth } = useWorkspace()

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
      className={`w-[1024px] h-[768px] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] rounded-lg transition-all shrink-0 select-none touch-none ${cursorClass}`}
      style={cursorStyle}
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
                ? "hover:stroke-red-500 hover:stroke-[8px] transition-all duration-150 cursor-pointer"
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
  )
}
