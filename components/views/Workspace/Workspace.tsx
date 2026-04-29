import LeftToolbar from "./LeftToolbar"
import RightToolbar from "./RightToolbar"
import BottomToolbar from "./BottomToolbar"
import Canvas from "./Canvas"

function Workspace() {
  return (
    <div className="h-full w-full relative flex bg-[#f3f2ef]">
      <LeftToolbar />
      <RightToolbar />
      <BottomToolbar />
      <div className="w-full h-full flex-1 overflow-auto p-4 sm:p-8">
        <div className="w-full h-full flex items-center justify-center min-w-max min-h-max">
          <Canvas />
        </div>
      </div>
    </div>
  )
}

export default Workspace
