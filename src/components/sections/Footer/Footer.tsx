import React from "react"

function Footer() {
  return (
    <footer className="bg-[#111827] py-2 text-white border-t border-secondary text-center">
      <span className="text-sm md:text-lg">
        Sketchly - All Right Reserved @{new Date().getFullYear()} RazorPG
      </span>
    </footer>
  )
}

export default Footer
