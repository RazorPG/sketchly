import { ReactNode } from "react"
import WorkspaceNavbar from "../../sections/WorkspaceNavbar"

type PropTypes = {
  children: ReactNode
}

function WorkspaceLayout({ children }: PropTypes) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f3f2ef]">
      <WorkspaceNavbar />
      <main className="flex-1 relative overflow-hidden">{children}</main>
    </div>
  )
}

export default WorkspaceLayout
