import { FiEdit2, FiTrash2, FiDownload } from "react-icons/fi"
import { FaRegHandPaper } from "react-icons/fa"
import { BsEraser } from "react-icons/bs"

export default function LeftToolbar() {
  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-xl shadow-md border border-gray-100 p-2 flex flex-col items-center gap-3 w-12 z-10">
      {/* Tools */}
      <button className="p-2 bg-blue-50 text-blue-600 rounded-lg transition-colors bg-opacity-50">
        <FiEdit2 className="text-lg" />
      </button>
      <button className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
        <BsEraser className="text-lg" />
      </button>
      <button className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
        <FaRegHandPaper className="text-lg" />
      </button>
      
      {/* Properties */}
      <button className="p-2 w-full flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors">
        <div className="w-4 h-4 rounded-full bg-black"></div>
      </button>
      <button className="p-2 w-full flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors">
        <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
      </button>
      
      <div className="w-6 border-b border-gray-200 my-1"></div>
      
      {/* Actions */}
      <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
        <FiTrash2 className="text-lg" />
      </button>
      <button className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
        <FiDownload className="text-lg" />
      </button>
    </div>
  )
}
