import React from "react"
import { FiPlus } from "react-icons/fi"

function HomeActionBlank() {
  return (
    <button className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-300 rounded-xl p-4 w-full h-56">
      <div className="flex justify-center items-center gap-2 bg-gray-100 p-2 rounded-full cursor-pointer">
        <FiPlus className="text-2xl text-gray-500" />
      </div>
      <p className="text-lg font-medium text-gray-500">New Sketch</p>
    </button>
  )
}

export default HomeActionBlank
