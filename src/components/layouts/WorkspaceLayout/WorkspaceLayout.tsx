import { ReactNode } from "react"
import WorkspaceNavbar from "../../sections/WorkspaceNavbar"
import { WorkspaceProvider } from "@/contexts/WorkspaceContext"

type PropTypes = {
  children: ReactNode
}

function WorkspaceLayout({ children }: PropTypes) {
  return (
    <WorkspaceProvider>
      <div className="flex flex-col h-screen overflow-hidden bg-[#f3f2ef]">
        <WorkspaceNavbar />
        <main className="flex-1 relative overflow-hidden">{children}</main>
      </div>
    </WorkspaceProvider>
  )
}

export default WorkspaceLayout
