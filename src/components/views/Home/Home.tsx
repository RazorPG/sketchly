"use client"

import HomeActionBlank from "./HomeActionBlank"
import HomeWorkspaceItem from "./HomeWorkspaceItem"
import HomeHeader from "./HomeHeader"
import useHome from "./useHome"
import { Skeleton } from "@heroui/react"

function Home() {
  const { workspaces, isLoading, searchQuery } = useHome()

  const hasWorkspaces = workspaces?.length > 0
  const showBlankAction = !searchQuery
  const showEmptySearch = !isLoading && !hasWorkspaces && searchQuery

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
      <HomeHeader />

      {showEmptySearch ? (
        <div className="mt-20 flex flex-col items-center justify-center text-center">
          <p className="text-gray-500 text-lg">
            No workspaces found matching "{searchQuery}"
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Try adjusting your search keywords.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {showBlankAction && <HomeActionBlank />}

          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="p-4 border rounded-xl flex flex-col gap-3"
              >
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}

          {!isLoading &&
            hasWorkspaces &&
            workspaces.map(workspace => (
              <HomeWorkspaceItem
                key={workspace.id}
                title={workspace.title}
                updateAt={workspace.updatedAt}
                id={workspace.id}
              />
            ))}
        </div>
      )}
    </main>
  )
}

export default Home
