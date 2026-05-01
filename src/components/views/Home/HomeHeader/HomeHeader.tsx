import SearchInput from "../../../ui/SearchInput"
import useHome from "../useHome"

function HomeHeader() {
  const { workspaces } = useHome()
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Your projects
        </h2>
        <p className="text-sm text-gray-500">
          {workspaces.length || 0} workspaces saved
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
        <SearchInput placeholder="Search projects" />
      </div>
    </div>
  )
}

export default HomeHeader
