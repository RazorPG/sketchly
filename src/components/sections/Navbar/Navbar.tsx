import { Show, SignInButton, UserButton } from "@clerk/nextjs"
import { FaPalette } from "react-icons/fa"

export default function Navbar() {
  return (
    <nav
      suppressHydrationWarning
      className="sticky top-0 z-50 flex bg-white px-4 py-3 h-16 border-b border-gray-300"
    >
      <div className="mx-auto max-w-7xl w-full flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-black text-white p-2 rounded-xl flex items-center justify-center">
            <FaPalette className="text-xl" />
          </div>
          <span className="text-lg font-medium text-black">Sketchly</span>
        </div>
        <div className="flex items-center gap-2">
          <Show when="signed-out">
            <SignInButton>
              <button className="bg-black text-white rounded-full font-medium text-sm sm:text-base px-4 sm:px-5 py-3 cursor-pointer">
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
