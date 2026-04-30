"use client"

import LeftToolbar from "./LeftToolbar"
import RightToolbar from "./RightToolbar"
import BottomToolbar from "./BottomToolbar"
import Canvas from "./Canvas"
import { useWorkspace } from "./useWorkspace"

function Workspace() {
  const { isLoading } = useWorkspace()

  return (
    <div className="h-full w-full relative flex bg-[#f3f2ef]">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : null}
      <LeftToolbar />
      <RightToolbar />
      <BottomToolbar />
      <div
        id="canvas-container"
        className="w-full h-full flex-1 overflow-hidden p-4 sm:p-8"
      >
        <div className="w-full h-full flex items-center justify-center min-w-max min-h-max">
          <Canvas />
        </div>
      </div>
    </div>
  )
}

export default Workspace
