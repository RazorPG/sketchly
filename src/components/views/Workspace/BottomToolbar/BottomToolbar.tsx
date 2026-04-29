"use client"

import { FiCornerUpLeft, FiCornerUpRight } from "react-icons/fi"
import { useWorkspace } from "../../../../contexts/WorkspaceContext"

export default function BottomToolbar() {
  const { strokes, undo, redo, canUndo, canRedo } = useWorkspace()

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-md border border-gray-100 py-2 px-3 flex items-center gap-3 z-10">
      <button
        onClick={undo}
        disabled={!canUndo}
        className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
        title="Undo"
      >
        <FiCornerUpLeft className="text-lg" />
      </button>
      <button
        onClick={redo}
        disabled={!canRedo}
        className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
        title="Redo"
      >
        <FiCornerUpRight className="text-lg" />
      </button>

      <div className="h-6 border-r border-gray-200 mx-1"></div>

      <div className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full border border-gray-200">
        {strokes.length} strokes
      </div>
    </div>
  )
}
