import React from "react"
import { FiImage, FiMoreHorizontal } from "react-icons/fi"

function HomeWorkspaceItem() {
  return (
    <div className="flex flex-col items-start justify-between border-2 border-gray-200 rounded-xl overflow-hidden w-full h-56">
      <button className="w-full h-full flex items-center justify-center bg-gray-50 cursor-pointer">
        <FiImage className="text-4xl text-gray-300" />
      </button>
      <div className="flex items-center justify-between w-full border-t border-gray-200 p-4">
        <div className="flex flex-col text-left">
          <h3 className="text-lg font-medium text-gray-900">Sketch 1</h3>
          <p className="text-sm text-gray-500">2 days ago</p>
        </div>

        <button className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
          <FiMoreHorizontal className="text-lg" />
        </button>
      </div>
    </div>
  )
}

export default HomeWorkspaceItem
