import { FiCornerUpLeft, FiCornerUpRight } from "react-icons/fi"

export default function BottomToolbar() {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-md border border-gray-100 py-2 px-3 flex items-center gap-3 z-10">
      <button className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50">
        <FiCornerUpLeft className="text-lg" />
      </button>
      <button className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50">
        <FiCornerUpRight className="text-lg" />
      </button>
      
      <div className="h-6 border-r border-gray-200 mx-1"></div>
      
      <div className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full border border-gray-200">
        0 strokes
      </div>
    </div>
  )
}
