"use client"

import HomeActionBlank from "./HomeActionBlank"
import HomeWorkspaceItem from "./HomeWorkspaceItem"
import HomeHeader from "./HomeHeader"
import useHome from "./useHome"
import { Skeleton } from "@heroui/react"

function Home() {
  const { workspaces, isLoading } = useHome()
  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
      <HomeHeader />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        <HomeActionBlank />
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 border rounded-xl flex flex-col gap-3">
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}

        {!isLoading &&
          workspaces?.length > 0 &&
          workspaces.map(workspace => (
            <HomeWorkspaceItem
              key={workspace.id}
              title={workspace.title}
              updateAt={workspace.updatedAt}
              id={workspace.id}
            />
          ))}
      </div>
    </main>
  )
}

export default Home
