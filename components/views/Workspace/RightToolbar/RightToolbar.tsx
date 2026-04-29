import { FiPlus, FiMinus, FiMaximize } from "react-icons/fi"

export default function RightToolbar() {
  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-xl shadow-md border border-gray-100 p-2 flex flex-col items-center gap-2 w-12 z-10">
      <button className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
        <FiPlus className="text-lg" />
      </button>
      
      <div className="py-1 text-xs font-medium text-gray-600">
        91%
      </div>
      
      <button className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
        <FiMinus className="text-lg" />
      </button>
      
      <div className="w-6 border-b border-gray-200 my-1"></div>
      
      <button className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
        <FiMaximize className="text-lg" />
      </button>
    </div>
  )
}
