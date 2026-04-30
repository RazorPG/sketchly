import { Show, SignInButton, UserButton } from "@clerk/nextjs"
import { FiArrowLeft, FiChevronDown } from "react-icons/fi"
import { FaPalette } from "react-icons/fa"
import Link from "next/link"

export default function WorkspaceNavbar() {
  return (
    <nav className="sticky top-0 z-50 flex bg-white px-4 py-2 h-14 border-b border-gray-200">
      <div className="mx-auto max-w-7xl w-full flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Show when="signed-in">
            <Link
              href="/"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
            >
              <FiArrowLeft className="text-xl" />
            </Link>
          </Show>
          <div className="flex items-center gap-2 border-r border-gray-200 pr-4">
            <div className="bg-black text-white p-1.5 rounded-lg flex items-center justify-center">
              <FaPalette className="text-sm" />
            </div>
            <span className="text-base font-medium text-black">Sketchly</span>
          </div>

          <Show when="signed-in">
            <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-700 font-medium text-sm ml-1">
              <span>Untitled Sketch</span>
              <FiChevronDown className="text-gray-500" />
            </button>
          </Show>
        </div>

        <div className="flex items-center gap-2">
          <Show when="signed-out">
            <SignInButton>
              <button className="bg-black text-white rounded-full font-medium text-sm h-9 px-4 cursor-pointer">
                Sign In
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </div>
    </nav>
  )
}
