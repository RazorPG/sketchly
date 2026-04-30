import { useWorkspaceContext } from "../../../../contexts/WorkspaceContext"

export default function useRightToolbar() {
  const { zoom, setZoom } = useWorkspaceContext()

  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 3)) // Max 300%
  }

  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.1)) // Min 10%
  }

  const resetView = () => {
    setZoom(1)
    // Center the scroll container after render
    setTimeout(() => {
      const container = document.getElementById("canvas-container")
      if (container) {
        container.scrollLeft =
          (container.scrollWidth - container.clientWidth) / 2
        container.scrollTop =
          (container.scrollHeight - container.clientHeight) / 2
      }
    }, 0)
  }

  return {
    zoom,
    zoomIn,
    zoomOut,
    resetView,
  }
}
